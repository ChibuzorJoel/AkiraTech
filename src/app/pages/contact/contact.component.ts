import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements AfterViewInit {
  @ViewChildren('reveal') reveals!: QueryList<ElementRef>;
 
  submitted = false;
  formSubmitted = false; // tracks if user clicked submit (triggers validation display)
 
  form = {
    firstName: '', lastName: '',
    email: '', phone: '',
    service: '', budget: '', message: ''
  };
 
  services = [
    'Website Development', 'Mobile App Development',
    'E-Commerce Store', 'UI/UX Design',
    'SEO & Digital Marketing', 'Website Maintenance', 'Other'
  ];
 
  budgets = [
    'Under ₦150,000', '₦150,000 – ₦350,000',
    '₦350,000 – ₦750,000', 'Over ₦750,000', "Let's discuss"
  ];
 
  faqs = [
    { icon: '⚡', q: 'How fast do you respond?',            a: 'We reply within 2–4 hours during business hours. WhatsApp gets the fastest response.' },
    { icon: '💰', q: 'Is the consultation really free?',    a: 'Yes — 100% free. No credit card, no commitment. Just a conversation about your project.' },
    { icon: '🌍', q: 'Do you work remotely?',               a: 'We work with clients across Nigeria, Africa and beyond entirely online.' },
    { icon: '📅', q: 'How long does a project take?',       a: 'Websites take 2–4 weeks. Mobile apps 4–10 weeks. We give a firm timeline upfront.' },
    { icon: '💳', q: 'What payment methods do you accept?', a: 'Paystack, bank transfer and Flutterwave. Instalments available for larger projects.' },
    { icon: '🔒', q: 'Is my project idea confidential?',   a: 'Completely. We treat every enquiry with full discretion and never share your ideas.' },
  ];
 
  // ── Validation helpers ──────────────────────────────────
  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
 
  isValidPhone(phone: string): boolean {
    return phone.trim().length >= 7;
  }
 
  get errors() {
    return {
      firstName: !this.form.firstName.trim(),
      lastName:  !this.form.lastName.trim(),
      email:     !this.form.email.trim() || !this.isValidEmail(this.form.email),
      emailFormat: this.form.email.trim().length > 0 && !this.isValidEmail(this.form.email),
      phone:     !this.form.phone.trim() || !this.isValidPhone(this.form.phone),
      service:   !this.form.service,
      message:   this.form.message.trim().length < 10,
    };
  }
 
  get isFormValid(): boolean {
    const e = this.errors;
    return !e.firstName && !e.lastName && !e.email && !e.phone && !e.service && !e.message;
  }
 
  get errorCount(): number {
    return Object.values(this.errors).filter(Boolean).length;
  }
 
  // Show error for a field only after user has tried to submit
  show(field: string): boolean {
    return this.formSubmitted && (this.errors as Record<string, boolean>)[field];
  }
 
  submit() {
    this.formSubmitted = true;
    if (!this.isFormValid) return;
    this.submitted = true;
    setTimeout(() => {
      this.submitted = false;
      this.formSubmitted = false;
      this.form = { firstName:'', lastName:'', email:'', phone:'', service:'', budget:'', message:'' };
    }, 6000);
  }
 
  ngAfterViewInit() {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    this.reveals.forEach(r => obs.observe(r.nativeElement));
  }
}