import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UtilityService } from '../../core/services/utility.service';
import { ITask } from '../models/task.interface';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private http = inject(HttpClient);
    private utilService = inject(UtilityService);
    getTaskList(): Observable<ITask[]> {
        const url = 'api/mock-tasks.json'
        return this.http.get<ITask[]>(url).pipe(map((tasks: ITask[]) => {
            return tasks.map(task => ({ id: task.id, title: task.title, completed: task.completed, creationDate: this.utilService.getRandomDate() }));
        }));
    }
}
