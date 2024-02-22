import {Component, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.scss',
})
export class LabsComponent {
  newTask!: { id: number; tittle: string };
  newTaskTitle: WritableSignal<string> = signal('');
  tasks: WritableSignal<{ id: number; tittle: string }[]> = signal([
    {id: 1, tittle: 'Lazy Loading'},
    {id: 2, tittle: 'Defer'},
    {id: 3, tittle: 'Runtime'},
  ]);

  colorCtrl = new FormControl();

  constructor() {
    this.colorCtrl.valueChanges.subscribe(value => console.log(value));
    console.log("getRawValue() ->", this.colorCtrl.getRawValue())
  }

  newTaskUpdate(event: KeyboardEvent) {
    const newValue = event.target as HTMLInputElement;
    this.newTaskTitle.set(newValue.value);
  }

  createTaskHandler() {
    const newTaskValue: { id: number; tittle: string } = {
      id: Math.floor(Math.random() * 10000),
      tittle: this.newTaskTitle(),
    };
    //this.tasks.set([newTaskValue, ...this.tasks]);
    this.tasks.update(tasks => [newTaskValue, ...tasks]);
    this.newTaskTitle.set('');
  }

  deleteItemHandle(taskId: number) {
    console.log(taskId);
    this.tasks.update(tasks => tasks.filter(task => task.id !== taskId));
  }
}
