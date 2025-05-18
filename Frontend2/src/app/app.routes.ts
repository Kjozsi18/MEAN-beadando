import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { PlantsComponent } from './components/plants/plants.component';
import { ProjectsComponent } from './components/projects/projects.component';

export const routes: Routes = [
    {
    path:'', redirectTo:'dashboard', pathMatch:'full'
    },
    {
    path:'dashboard', component:DashboardComponent, canActivate: [AuthGuard]
    },
    {
    path:'plants', component:PlantsComponent, canActivate: [AuthGuard]
    },
    {
    path:'project', component:ProjectsComponent, canActivate: [AuthGuard]
    },
    {
    path:'registration', component:RegistrationComponent
    },
    {
    path:'login', component:LoginComponent
    }
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
