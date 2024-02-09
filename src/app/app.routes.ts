import {Routes} from '@angular/router';
import {LabsComponent} from './pages/labs/labs.component';
import {HomeComponent} from './pages/home/home.component';
import {authGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {path: '', component: HomeComponent},
      {path: 'laboratory', component: LabsComponent}
    ]
  }
];
