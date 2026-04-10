import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  submitted = false;
  formSubmitted = false;
  submitting = false;
  submitError = false;
  errorMessage = '';

  // Terms and conditions
  agreeToTerms = false;
  showTermsModal = false;
  showPrivacyModal = false;

  registerForm = {
    fullName: '',
    email: '',
    phone: '',
    course: '',
    source: '',
    message: ''
  };

  courses = [
    'Web Development (Full Stack)',
    'Mobile App Development',
    'UI/UX Design',
    'Data Science',
    'Digital Marketing',
    'EduTech Development',
    'Graphic Design',
    'Cybersecurity'
  ];

  sources = [
    'Google Search',
    'Instagram',
    'Twitter/X',
    'LinkedIn',
    'WhatsApp',
    'Friend/Family',
    'Email Newsletter',
    'Other'
  ];

  constructor(private http: HttpClient, private router: Router) {}

  get isFormValid(): boolean {
    return this.registerForm.fullName.trim() !== '' &&
           this.registerForm.email.trim() !== '' &&
           this.isValidEmail(this.registerForm.email) &&
           this.registerForm.phone.trim() !== '' &&
           this.registerForm.course !== '' &&
           this.agreeToTerms === true; // Terms validation added
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone: string): boolean {
    return phone.trim().length >= 7;
  }

  showError(field: string): boolean {
    if (!this.formSubmitted) return false;
    
    switch(field) {
      case 'fullName':
        return !this.registerForm.fullName.trim();
      case 'email':
        return !this.registerForm.email.trim() || !this.isValidEmail(this.registerForm.email);
      case 'phone':
        return !this.registerForm.phone.trim() || !this.isValidPhone(this.registerForm.phone);
      case 'course':
        return !this.registerForm.course;
      case 'terms':
        return !this.agreeToTerms;
      default:
        return false;
    }
  }

  // Modal methods
  openTermsModal(event: Event) {
    event.preventDefault();
    this.showTermsModal = true;
    document.body.style.overflow = 'hidden';
  }

  openPrivacyModal(event: Event) {
    event.preventDefault();
    this.showPrivacyModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showTermsModal = false;
    this.showPrivacyModal = false;
    document.body.style.overflow = '';
  }

  acceptTerms() {
    this.agreeToTerms = true;
    this.closeModal();
  }

  submit() {
    this.formSubmitted = true;
    if (!this.isFormValid) return;
    
    this.submitting = true;
    this.submitError = false;
    
    const formData = {
      fullName: this.registerForm.fullName,
      email: this.registerForm.email,
      phone: this.registerForm.phone,
      course: this.registerForm.course,
      source: this.registerForm.source || 'Not specified',
      message: this.registerForm.message || 'No message provided',
      agreedToTerms: this.agreeToTerms,
      submittedAt: new Date().toISOString(),
      page: 'Registration Page'
    };
    
    // Replace with your Formspree registration form endpoint
    const formspreeUrl = 'https://formspree.io/f/xjgppopv';
    
    this.http.post(formspreeUrl, formData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
        
        // Reset form after 5 seconds and redirect or show success
        setTimeout(() => {
          this.submitted = false;
          this.formSubmitted = false;
          this.resetForm();
          // Optional: Redirect to home or contact page
          // this.router.navigate(['/']);
        }, 5000);
      },
      error: () => {
        this.submitting = false;
        this.submitError = true;
        this.errorMessage = 'Registration failed. Please try again or contact us directly on WhatsApp.';
        
        setTimeout(() => {
          this.submitError = false;
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  resetForm() {
    this.registerForm = {
      fullName: '',
      email: '',
      phone: '',
      course: '',
      source: '',
      message: ''
    };
    this.agreeToTerms = false;
    this.formSubmitted = false;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}