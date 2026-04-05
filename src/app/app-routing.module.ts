import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent }      from './pages/home/home.component';
import { AboutComponent }     from './pages/about/about.component';
import { ServicesComponent }  from './pages/services/services.component';
import { ContactComponent }   from './pages/contact/contact.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  { path: '',           component: HomeComponent },
  { path: 'about',      component: AboutComponent },
  { path: 'services',   component: ServicesComponent },
  { path: 'projects',   component: PortfolioComponent },
  { path: 'contact',    component: ContactComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**',         redirectTo: '' }                  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',    // scroll to top on every navigation
    anchorScrolling: 'enabled'           // supports fragment links (#section)
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }