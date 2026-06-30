// src/app/pages/payment/payment.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

const API_BASE = 'http://localhost:5000/api';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {

  // Data passed from register page via router state
  fullName = '';
  email    = '';
  phone    = '';
  course   = '';
  registrationId = '';

  // Pricing
  amount    = 0;
  formatted = '';
  loadingPrice = true;
  priceError   = '';

  // Payment method
  selectedMethod: 'payaza' | 'bank_transfer' | '' = '';

  // Bank transfer
  transferReference = '';
  receiptNote       = '';
  showRefError      = false;

  // State
  submitting = false;
  error      = '';

  // Bank details (real account)
  bankDetails = {
    bankName:      'Kuda Bank',
    accountNumber: '3003782830',
    accountName:   'Akiira Information Tech Ltd',
  };

  constructor(
    private http:   HttpClient,
    private router: Router,
    private route:  ActivatedRoute,
  ) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;

    if (state && state.fullName) {
      this.fullName       = state.fullName       || '';
      this.email          = state.email          || '';
      this.phone           = state.phone          || '';
      this.course          = state.course         || '';
      this.registrationId  = state.registrationId || '';

      sessionStorage.setItem('akiira_payment_data', JSON.stringify({
        fullName: this.fullName, email: this.email, phone: this.phone,
        course: this.course, registrationId: this.registrationId,
      }));
    } else {
      const saved = sessionStorage.getItem('akiira_payment_data');
      if (saved) {
        const data = JSON.parse(saved);
        this.fullName       = data.fullName       || '';
        this.email          = data.email          || '';
        this.phone           = data.phone          || '';
        this.course          = data.course         || '';
        this.registrationId  = data.registrationId || '';
      } else {
        this.router.navigate(['/register']);
        return;
      }
    }

    this.loadPrice();
  }

  async loadPrice() {
    this.loadingPrice = true;
    this.priceError = '';
    try {
      const res: any = await this.http
        .get(`${API_BASE}/payments/price/${encodeURIComponent(this.course)}`)
        .toPromise();
      this.amount    = res.price;
      this.formatted = res.formatted;
      if (res.bank) this.bankDetails = res.bank;
    } catch {
      this.priceError = 'Failed to load course price. Please go back and try again.';
    } finally {
      this.loadingPrice = false;
    }
  }

  selectMethod(method: 'payaza' | 'bank_transfer') {
    this.selectedMethod = method;
    this.error = '';
    this.showRefError = false;
  }

  get canSubmit(): boolean {
    if (!this.selectedMethod) return false;
    if (this.selectedMethod === 'bank_transfer' && !this.transferReference.trim()) return false;
    return true;
  }

  async submit() {
    this.error = '';
    this.showRefError = false;

    if (!this.selectedMethod) {
      this.error = 'Please select a payment method to continue.';
      return;
    }

    if (this.selectedMethod === 'bank_transfer' && !this.transferReference.trim()) {
      this.showRefError = true;
      this.error = 'Please enter your transfer reference number.';
      return;
    }

    this.submitting = true;

    if (this.selectedMethod === 'payaza') {
      await this.initiatePayaza();
    } else {
      await this.submitBankTransfer();
    }
  }

  private async initiatePayaza() {
    try {
      const res: any = await this.http.post(`${API_BASE}/payments/initiate-payaza`, {
        registrationId: this.registrationId,
        fullName: this.fullName,
        email:    this.email,
        phone:    this.phone,
        course:   this.course,
      }).toPromise();

      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        this.error = 'Failed to initiate payment. Please try again.';
        this.submitting = false;
      }
    } catch (err: any) {
      this.error = err?.error?.message || 'Payment initiation failed. Please try again or use bank transfer.';
      this.submitting = false;
    }
  }

  private async submitBankTransfer() {
    try {
      const res: any = await this.http.post(`${API_BASE}/payments/bank-transfer`, {
        registrationId:    this.registrationId,
        fullName:          this.fullName,
        email:             this.email,
        phone:             this.phone,
        course:            this.course,
        transferReference: this.transferReference,
        receiptNote:       this.receiptNote,
      }).toPromise();

      sessionStorage.removeItem('akiira_payment_data');

      this.router.navigate(['/payment-success'], {
        state: {
          method:    'bank_transfer',
          fullName:  this.fullName,
          email:     this.email,
          course:    this.course,
          amount:    this.amount,
          formatted: this.formatted,
          paymentId: res.paymentId,
          transferReference: this.transferReference,
        }
      });
    } catch (err: any) {
      this.error = err?.error?.message || 'Submission failed. Please try again.';
      this.submitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/register']);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Account number copied!');
    });
  }
}