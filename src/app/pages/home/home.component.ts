import {Component, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  tasks: WritableSignal<{ id: number; tittle: string }[]> = signal([
    {id: 1, tittle: 'Lazy Loading'},
    {id: 2, tittle: 'Defer'},
    {id: 3, tittle: 'Runtime'},
  ]);
  newTaskTitle: WritableSignal<string> = signal('');

  createTaskHandler(event: any) {
    const value = event.target as HTMLInputElement;

    this.newTaskTitle.set(value.value)

    const newTaskValue: { id: number; tittle: string } = {
      id: Math.floor(Math.random() * 10000),
      tittle: this.newTaskTitle()
    }
    this.tasks.update(tasks => [newTaskValue, ...tasks]);
    this.newTaskTitle.set('');

  }

  deleteItemHandle(taskId: number) {
    console.log(taskId)
    this.tasks.update(tasks => tasks.filter(task => task.id !== taskId))
  }
}
