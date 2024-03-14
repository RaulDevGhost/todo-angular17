import {Routes} from '@angular/router';
import {LabsComponent} from './pages/labs/labs.component';
import {HomeComponent} from './pages/home/home.component';
import {authGuard} from "./guards/auth.guard";
import {AppComponent} from "./app.component";
import {ContainerComponent} from "./components/container/container.component";

export const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'container',
    component: HomeComponent
  },
  {
    path: 'container/:containerId/container',
    component: ContainerComponent
  },
  // {
  //   path: 'home',
  //   canActivate: [authGuard],
  //   children: [
  //     {path: 'home', component: HomeComponent},
  //     {path: 'laboratory', component: LabsComponent}
  //   ]
  // },

];
