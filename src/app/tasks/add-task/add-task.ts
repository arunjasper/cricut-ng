import { Component, computed, inject, input, output } from '@angular/core';
import { TaskStore } from '../../core/services/task.store';
import { ITask } from '../../core/models/task.interface';

@Component({
  selector: 'app-add-task',
  imports: [],
  templateUrl: './add-task.html',
  styleUrl: './add-task.scss',
})
export class AddTask {
  store = inject(TaskStore);
  readonly closeEvent = output<void>();

  onSave(title: string) {
    this.store.addTask({ id: this.generateId(), completed: false, creationDate: new Date(), title: title });
    this.closeEvent.emit();
  }

  generateId() {
    return Math.floor(Math.random() * 1000);
  }


  onClose() {
    this.closeEvent.emit();
  }
}


