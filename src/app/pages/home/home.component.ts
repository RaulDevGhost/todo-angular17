import {Component, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Task} from "../../models/task.model";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
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


  settingTask(event: Event) {
    const value = event.target as HTMLInputElement;
    this.newTaskTitle.set(value.value)
  }

  createTaskHandler(event: Event) {
    const value = event.target as HTMLInputElement;
    this.newTaskTitle.set(value.value)
    const newTaskValue: Task = {
      id: Math.floor(Math.random() * 10000),
      title: this.newTaskTitle(),
      completed: false
    }
    this.tasks.update(tasks => [newTaskValue, ...tasks]);
    this.newTaskTitle.set('');
  }

  toggleEdit(taskId: number) {
    this.editToggle.set(!this.editToggle());
    this.selectedId.set(taskId)
  }

  completeTaskHandle(task: Task) {
    // this.tasks.update(todos => {
    //   return todos.map((todo) => {
    //     if (todo.id === task.id) {
    //       return {
    //         ...todo,
    //         completed: !todo.completed
    //       }
    //     }
    //     return todo
    //   })
    // })
    const newTask: Task = {
      ...task,
      completed: !task.completed
    }
    this.tasks.update(tasks => tasks.map((todo: Task) => todo.id === task.id ? newTask : todo))
    console.log(this.tasks())
  }

  updateTaskHandle(event: Event, todo: Task) {
    const value = event.target as HTMLInputElement;
    // const newTodo = {
    //   ...todo,
    //   title: value.value !==
    // }
    console.log(value.value, todo);
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
