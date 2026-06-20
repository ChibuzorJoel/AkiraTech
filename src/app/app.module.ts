import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
<<<<<<< HEAD
import { HttpClientModule } from '@angular/common/http'; // Add this import
=======
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; // Add this import
>>>>>>> 099fdc74fd5256915004f084e838813b64f02078

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { RegisterComponent } from './pages/register/register.component';

import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { TermsOfServiceComponent } from './shared/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './shared/privacy-policy/privacy-policy.component';
<<<<<<< HEAD
=======
import { LoginComponent } from './admin/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { RegistrationComponent } from './admin/registration/registration.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
>>>>>>> 099fdc74fd5256915004f084e838813b64f02078




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    ServicesComponent,
    ContactComponent,
    PortfolioComponent,
    RegisterComponent,

    CourseDetailComponent,
    TermsOfServiceComponent,
    PrivacyPolicyComponent,
<<<<<<< HEAD
=======
    LoginComponent,
    DashboardComponent,
    RegistrationComponent,
    SidebarComponent,
>>>>>>> 099fdc74fd5256915004f084e838813b64f02078

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
<<<<<<< HEAD
  providers: [],
=======
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
>>>>>>> 099fdc74fd5256915004f084e838813b64f02078
  bootstrap: [AppComponent]
})
export class AppModule { }