import { IBaseTask } from './base-task.interface';

export interface ITask extends IBaseTask {
    creationDate: Date;
}
