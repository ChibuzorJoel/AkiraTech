import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Add this import

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
<<<<<<< HEAD
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { TermsOfServiceComponent } from './shared/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './shared/privacy-policy/privacy-policy.component';
=======
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { CookieBannerComponent } from './pages/cookie-banner/cookie-banner.component';
import { RefundPolicyComponent } from './pages/refund-policy/refund-policy.component';
>>>>>>> 2ec4906f09b7035cd63d59d2fd12095ec372c679


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
<<<<<<< HEAD
    CourseDetailComponent,
    TermsOfServiceComponent,
    PrivacyPolicyComponent,
=======
    PrivacyPolicyComponent,
    CookieBannerComponent,
    RefundPolicyComponent,
>>>>>>> 2ec4906f09b7035cd63d59d2fd12095ec372c679
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }