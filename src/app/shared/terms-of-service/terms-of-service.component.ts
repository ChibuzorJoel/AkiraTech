import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.css']
})
export class TermsOfServiceComponent {
  @Output() close = new EventEmitter<void>();
  @Output() accept = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  acceptTerms() {
    this.accept.emit();
  }
}