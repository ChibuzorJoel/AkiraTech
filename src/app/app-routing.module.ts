import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { RegisterComponent } from './pages/register/register.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';

// Admin imports

import { LoginComponent } from './admin/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { RegistrationComponent } from './admin/registration/registration.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminContactComponent } from './admin/contact/contact.component';

const routes: Routes = [
  // Public routes
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'projects', component: PortfolioComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login',         component: LoginComponent },
  { path: 'dashboard',     component: DashboardComponent,     canActivate: [AuthGuard] },
  { path: 'registrations', component: RegistrationComponent, canActivate: [AuthGuard] },
  { path: 'admin/contact', component: AdminContactComponent, canActivate: [AuthGuard] },
  { path: '',              redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**',            redirectTo: '/dashboard' },

  { path: 'course/:id', component: CourseDetailComponent },
  
  // Admin login - NO SIDEBAR
  { path: 'admin/login', component: LoginComponent },
  
  // Admin protected routes - WITH SIDEBAR (via AdminLayout)
  {
    path: 'admin',
    
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'registrations', component: RegistrationComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // Redirect old paths (optional)
  { path: 'login', redirectTo: '/admin/login' },
  { path: 'dashboard', redirectTo: '/admin/dashboard' },
  { path: 'registrations', redirectTo: '/admin/registrations' },
  
  // 404 - Wildcard must be LAST
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }