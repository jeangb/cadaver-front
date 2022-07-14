import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthenticationGuard } from './authentication.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
    // canActivate: [AuthenticationGuard]    
  },
  {
    path: 'register',
    component: RegisterComponent,
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),
    // canActivate: [AuthenticationGuard]    
  },
  {
    path: '',
    component: DashboardComponent,
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthenticationGuard]    
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
