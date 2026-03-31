import { inject } from '@angular/core';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import {
    patchState,
    signalStore,
    withMethods,
    withState,
    withHooks
} from '@ngrx/signals';
import { withStorageSync } from '@angular-architects/ngrx-toolkit';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { DataService } from './data.service';
import { ITask } from '../models/task.interface';

export interface ApplicationState {
    // Define the shape of your application state here
    taskList: ITask[];
    error: string | null;
}

const initialState: ApplicationState = {
    taskList: [],
    error: null
};

export const TaskStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withStorageSync({
        key: 'taskListState', // The key used in session storage
        storage: () => sessionStorage, // Specify sessionStorage / default - localStorage
    }),

    withMethods((store, dataService = inject(DataService)) => ({
        loadTaskList: rxMethod<void>(
            pipe(
                switchMap(() => {
                    const savedState = localStorage.getItem("taskListState");
                    if (savedState) {
                        const parsedState = JSON.parse(savedState);
                        patchState(store, parsedState);
                        return of([]);
                    }
                    return dataService.getTaskList().pipe(
                        tap((data) => {
                            patchState(store, { taskList: data, error: null });
                        }),
                        catchError((error) => {
                            patchState(store, { error: error.message });
                            return of([]); // Return an empty observable to complete the stream
                        })
                    )
                }
                )
            )
        ),
        addTask(task: ITask) {
            patchState(store, (state) => ({
                ...state,
                taskList: [...state.taskList, task],
            }));
        },
        removeTask(task: ITask) {
            patchState(store, (state) => ({
                ...state,
                taskList: state.taskList.filter(o => o.id !== task.id),

            }));
        },
        updateTask(task: ITask) {
            patchState(store, (state) => ({
                ...state,
                taskList: state.taskList.map(o => o.id === task.id ? task : o),
            }));
        }
    })),
    withHooks((store) => ({
        onInit() {
            // Check if the state is empty based on the synced data
            if (!store.taskList() || store.taskList().length === 0) {
                store.loadTaskList(); // Call API only if empty
            }
        },
    })),
);