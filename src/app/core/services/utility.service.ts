import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    sort(list: any[], sortBy: string, sortOrder: 'asc' | 'desc') {
        if (sortOrder === 'asc')
            list.sort((a, b) => (a[sortBy] < b[sortBy]) ? -1 : 1)
        else
            list.sort((a, b) => (a[sortBy] > b[sortBy]) ? -1 : 1)
    }

    getRandomDate() {
        const date1 = new Date('2026-01-01');
        const date2 = new Date('2026-07-01');
        const startTimestamp = date1.getTime();
        const endTimestamp = date2.getTime();
        const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
        return new Date(randomTimestamp);
    }

}