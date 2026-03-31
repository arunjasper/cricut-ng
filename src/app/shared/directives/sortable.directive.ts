import { Directive, HostListener, HostBinding, Output, EventEmitter, input } from '@angular/core';

@Directive({
    selector: '[appSortable]',
    standalone: true // Use standalone for modern Angular
})
export class SortableDirective {
    readonly appSortableKey = input<string>(); // The key to sort by
    readonly currentSortKey = input<string>(); // The currently active sort key
    readonly sortDirection = input<'asc' | 'desc' | ''>(); // The current sort direction

    @Output() sortChange = new EventEmitter<string>();

    // HostBinding to add a CSS class 'sortable' to the host element
    @HostBinding('class.sortable')
    readonly isSortable = true;

    // HostBinding to add a CSS class 'sorted-asc' if currently sorted ascending
    @HostBinding('class.sorted-asc')
    get isSortedAsc() {
        return this.currentSortKey() === this.appSortableKey() && this.sortDirection() === 'asc';
    }

    // HostBinding to add a CSS class 'sorted-desc' if currently sorted descending
    @HostBinding('class.sorted-desc')
    get isSortedDesc() {
        return this.currentSortKey() === this.appSortableKey() && this.sortDirection() === 'desc';
    }

    // HostListener to detect clicks on the host element
    @HostListener('click') onClick() {
        this.sortChange.emit(this.appSortableKey());
    }
}
