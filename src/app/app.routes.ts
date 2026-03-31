import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./tasks/tasks').then(
            (component) => component.Tasks
        ),
    },
];
