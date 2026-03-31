

import { Component, computed, inject, input, output } from '@angular/core';
import { ITask } from '../../core/models/task.interface';
import { TaskStore } from '../../core/services/task.store';


@Component({
  selector: 'app-edit-task',
  imports: [],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.scss',
})
export class EditTask {
  store = inject(TaskStore)
  selectedTask = input.required<ITask>();
  readonly closeEvent = output<void>();
  protected title = computed(() => this.selectedTask().title);
  
  onSave(title: string) {
    const task = this.selectedTask()
    this.store.updateTask({ ...task!, title: title });
    this.closeEvent.emit();
  }


  onClose() {
    this.closeEvent.emit();
  }

}
