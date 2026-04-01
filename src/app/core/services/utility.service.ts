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

}