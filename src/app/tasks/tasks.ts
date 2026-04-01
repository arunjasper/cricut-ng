
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SortableDirective } from "../shared/directives/sortable.directive";
import { UtilityService } from '../core/services/utility.service';
import { Drawer } from '../shared/ui/drawer/drawer';
import { Confirm } from '../shared/ui/confirm/confirm';
import { EditTask } from './edit-task/edit-task';
import { TaskStore } from '../core/services/task.store';
import { ITask } from '../core/models/task.interface';
import { startDateBeforeEndDateValidator } from '../core/services/form-validators';
import { AddTask } from "./add-task/add-task";


@Component({
  selector: 'app-tasks',
  imports: [DatePipe, Drawer, Confirm, ReactiveFormsModule, SortableDirective, EditTask, AddTask],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks {
  private readonly store = inject(TaskStore);
  utilityService = inject(UtilityService);
  taskItems = this.store.taskList;
  selectedTask = signal<ITask | undefined>(undefined)
  openModal = signal(false);
  confirmMessage = signal('');
  isDrawerOpen = signal(false);
  filterOpen = signal(true);

  currentSortKey = signal<'title' | 'creationDate'>('title');
  sortDirection = signal<'asc' | 'desc'>('asc');

  startDate = signal<Date | undefined>(undefined);
  endDate = signal<Date | undefined>(undefined);

  sortAsc = signal<boolean>(true);
  form: FormGroup;
  constructor() {
    this.form = new FormGroup({
      startDate: new FormControl<Date | null>(null),
      endDate: new FormControl<Date | null>(null)
    }, { validators: startDateBeforeEndDateValidator() });
  }

  onToggleStatus(task: ITask): void {
    this.store.updateTask({ ...task, completed: !task.completed });
  }

  protected filteredTaskList = computed(() => {
    let items = [...this.taskItems()];
    if (this.startDate()) {
      const from = new Date(this.startDate()!);
      items = items.filter(item => new Date(item.creationDate) >= from);
    }
    if (this.endDate()) {
      const to = new Date(this.endDate()!)
      const endOfDayTo = new Date(to);
      endOfDayTo.setHours(47, 59, 59, 999);
      items = items.filter(item => new Date(item.creationDate) <= endOfDayTo);
    }
    this.utilityService.sort(items, this.currentSortKey(), this.sortDirection());
    return items;
  })

  onFilter(): void {
    if (this.form.valid) {
      this.startDate.set(this.form.controls['startDate'].value!);
      this.endDate.set(this.form.controls['endDate'].value!);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onReset(): void {
    this.form.reset();
    this.startDate.set(undefined);
    this.endDate.set(undefined)
  }

  onAdd(): void {
    this.isDrawerOpen.set(true);
  }

  onEdit(task: ITask): void {
    this.selectedTask.set(task);
    this.isDrawerOpen.set(true);
  }

  toggleModal(value: boolean) {
    this.openModal.set(value);
  }

  toggleFilter() {
    this.filterOpen.set(!this.filterOpen())
  }

  onDelete(task: ITask) {
    this.selectedTask.set(task);
    const msg = `Delete this task?`
    this.confirmMessage.set(msg);
    this.toggleModal(true);
  }

  onConfirm() {
    this.store.removeTask(this.selectedTask()!)
    this.toggleModal(false);
    this.selectedTask.set(undefined);
  }

  onClose() {
    this.selectedTask.set(undefined)
    this.isDrawerOpen.set(false);
  }

  onSortChange(sortKey: string) {
    if (this.currentSortKey() === sortKey) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.currentSortKey.set(sortKey as 'title' | 'creationDate');
      this.sortDirection.set('asc');
    }
    this.utilityService.sort(this.filteredTaskList(), this.currentSortKey(), this.sortDirection());
  }

}

