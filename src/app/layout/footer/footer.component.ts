import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  showTermsModal = false;
  showPrivacyModal = false;
  showCookieModal = false;
  showRefundModal = false;

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

  openCookieModal(event: Event) {
    event.preventDefault();
    this.showCookieModal = true;
    document.body.style.overflow = 'hidden';
  }

  openRefundModal(event: Event) {
    event.preventDefault();
    this.showRefundModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeTermsModal() {
    this.showTermsModal = false;
    document.body.style.overflow = '';
  }

  closePrivacyModal() {
    this.showPrivacyModal = false;
    document.body.style.overflow = '';
  }

  closeCookieModal() {
    this.showCookieModal = false;
    document.body.style.overflow = '';
  }

  closeRefundModal() {
    this.showRefundModal = false;
    document.body.style.overflow = '';
  }

  acceptTerms() {
    this.closeTermsModal();
  }
}