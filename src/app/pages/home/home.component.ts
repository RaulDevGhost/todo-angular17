import {Component, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Task} from "../../models/task.model";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  tasks: WritableSignal<Task[]> = signal([
    {id: Math.floor(Math.random() * 10000), title: 'Lazy Loading', completed: false},
    {id: Math.floor(Math.random() * 10000), title: 'Defer', completed: false},
    {id: Math.floor(Math.random() * 10000), title: 'Runtime', completed: false},
  ]);
  newTaskTitle: WritableSignal<string> = signal('');
  editToggle: WritableSignal<boolean> = signal(false);
  selectedId: WritableSignal<number> = signal(0);
  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });


  settingTask(event: Event) {
    const value = event.target as HTMLInputElement;
    this.newTaskTitle.set(value.value)
  }

  createTaskHandler() {
    console.log("this.newTaskCtrl.valid->", this.newTaskCtrl.valid)
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.getRawValue();
      const newTaskValue: Task = {
        id: Math.floor(Math.random() * 10000),
        title: value,
        completed: false
      }
      this.tasks.update(tasks => [newTaskValue, ...tasks]);
      this.newTaskCtrl.setValue('')
    }
  }

  
  toggleEdit(taskId: number) {
    this.editToggle.set(!this.editToggle());
    this.selectedId.set(taskId)
  }

  completeTaskHandle(task: Task) {
    const newTask: Task = {
      ...task,
      completed: !task.completed
    }
    this.tasks.update(tasks => tasks.map((todo: Task) => todo.id === task.id ? newTask : todo))
    console.log(this.tasks())
  }

  updateTaskHandle(event: Event, todo: Task) {
    const value = event.target as HTMLInputElement;
    this.tasks.update(tasks => {
      return tasks.map(task => {
          if (task.id === todo.id) {
            this.editToggle.set(!this.editToggle());
            return {
              ...task,
              title: value.value !== task.title ? value.value : task.title
            }
          }
          this.editToggle.set(!this.editToggle());
          return task
        }
      )
    })
  }

  deleteTaskHandle(taskId: number) {
    console.log(taskId)
    this.tasks.update(tasks => tasks.filter(task => task.id !== taskId))
  }
}
