import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }      from './pages/home/home.component';
import { AboutComponent }     from './pages/about/about.component';
import { ServicesComponent }  from './pages/services/services.component';
import { ContactComponent }   from './pages/contact/contact.component';

const routes: Routes = [
  { path: '',           component: HomeComponent },
  { path: 'about',      component: AboutComponent },
  { path: 'services',   component: ServicesComponent },
  
  { path: 'contact',    component: ContactComponent },
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