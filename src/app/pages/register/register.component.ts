// register.component.ts  (replace your existing one)
import { Component, OnInit } from '@angular/core';
import { HttpClient }        from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

// ── point this at your backend ──
const API_BASE = 'http://localhost:5000/api';

@Component({
  selector:    'app-register',
  templateUrl: './register.component.html',
  styleUrls:   ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  submitted      = false;
  formSubmitted  = false;
  submitting     = false;
  submitError    = false;
  errorMessage   = '';

  agreeToTerms   = false;
  showTermsModal   = false;
  showPrivacyModal = false;

  registerForm = {
    fullName: '', email: '', phone: '',
    course: '', source: '', message: '',
  };

  courses = [
    'Web Development (Full Stack)', 'Frontend Development', 'Backend Development',
    'Mobile App Development', 'UI/UX Design', 'Data analysis',
    'Virtual assistance', 'Copywriting and CV writing', 'Social media management',
  ];

  sources = [
    'Google Search', 'Instagram', 'Twitter/X', 'LinkedIn',
    'WhatsApp', 'Friend/Family', 'Email Newsletter', 'Other',
  ];

  constructor(
    private http:  HttpClient,
    private router: Router,
    private route:  ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['course']) this.registerForm.course = params['course'];
    });
  }

  get isFormValid(): boolean {
    return (
      this.registerForm.fullName.trim() !== '' &&
      this.registerForm.email.trim()    !== '' &&
      this.isValidEmail(this.registerForm.email) &&
      this.registerForm.phone.trim()    !== '' &&
      this.registerForm.course          !== '' &&
      this.agreeToTerms === true
    );
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  isValidPhone(phone: string): boolean { return phone.trim().length >= 7; }

  showError(field: string): boolean {
    if (!this.formSubmitted) return false;
    switch (field) {
      case 'fullName': return !this.registerForm.fullName.trim();
      case 'email':    return !this.registerForm.email.trim() || !this.isValidEmail(this.registerForm.email);
      case 'phone':    return !this.registerForm.phone.trim() || !this.isValidPhone(this.registerForm.phone);
      case 'course':   return !this.registerForm.course;
      case 'terms':    return !this.agreeToTerms;
      default:         return false;
    }
  }

  openTermsModal(event: Event)   { event.preventDefault(); this.showTermsModal   = true; document.body.style.overflow = 'hidden'; }
  openPrivacyModal(event: Event) { event.preventDefault(); this.showPrivacyModal = true; document.body.style.overflow = 'hidden'; }
  closeTermsModal()   { this.showTermsModal   = false; document.body.style.overflow = ''; }
  closePrivacyModal() { this.showPrivacyModal = false; document.body.style.overflow = ''; }
  acceptTerms()       { this.agreeToTerms = true; this.closeTermsModal(); }

  /* ── Submit to Node backend ── */
  async proceedToCourse() {
    this.formSubmitted = true;
    this.submitError   = false;
    this.errorMessage  = '';

    if (!this.isFormValid) return;

    this.submitting = true;

    try {
      const payload = {
        fullName: this.registerForm.fullName,
        email:    this.registerForm.email,
        phone:    this.registerForm.phone,
        course:   this.registerForm.course,
        source:   this.registerForm.source  || 'Not specified',
        message:  this.registerForm.message || '',
      };

      await this.http.post(`${API_BASE}/registrations`, payload).toPromise();

      this.submitted = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      this.submitError  = true;
      this.errorMessage = err?.error?.message || 'Something went wrong. Please try again or contact us on WhatsApp.';
    } finally {
      this.submitting = false;
    }
  }

  resetForm() {
    this.registerForm  = { fullName: '', email: '', phone: '', course: '', source: '', message: '' };
    this.agreeToTerms  = false;
    this.formSubmitted = false;
    this.submitted     = false;
  }

  goBack() { this.router.navigate(['/']); }
}