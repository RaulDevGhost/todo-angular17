import {Component, computed, effect, inject, Injector, OnInit, signal, WritableSignal} from '@angular/core';
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
export class HomeComponent implements OnInit {
  tasks: WritableSignal<Task[]> = signal([
    {id: Math.floor(Math.random() * 10000), title: 'Lazy Loading', completed: false},
    {id: Math.floor(Math.random() * 10000), title: 'Defer', completed: true},
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
  filter: WritableSignal<'all' | 'pending' | 'completed'> = signal('all');
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    if (filter === 'pending') {
      return tasks.filter(task => !task.completed)
    }
    if (filter === 'completed') {
      return tasks.filter(task => task.completed)
    }
    return tasks
  })

  //este injector solo se utiliza cuando el effect esta en otro sitio
  //que no sea el constructor
  injector = inject(Injector)

  trackTasks() {
    effect(() => {
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, {injector: this.injector})
  }

  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      console.log(tasks)
      this.tasks.set(tasks)
    }
    this.trackTasks();
  }

  settingTask(event: Event) {
    const value = event.target as HTMLInputElement;
    this.newTaskTitle.set(value.value)
  }

  createTaskHandler() {
    console.log(this.newTaskCtrl.value.trim())
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.getRawValue().trim();
      if (value !== '') {
        const newTaskValue: Task = {
          id: Math.floor(Math.random() * 10000),
          title: value,
          completed: false
        }
        this.tasks.update(tasks => [newTaskValue, ...tasks]);
        this.newTaskCtrl.reset();
      }

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
    if (value.value.trim() !== '') {
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
      this.newTaskCtrl.reset();
    }
  }

  deleteTaskHandle(taskId: number) {
    this.tasks.update(tasks => tasks.filter(task => task.id !== taskId))
  }

  changeFilter(type: 'all' | 'pending' | 'completed') {
    this.filter.set(type);
  }
}
