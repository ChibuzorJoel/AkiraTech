import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  // Mobile menu state
  isMenuOpen: boolean = false;

  // Toggle mobile menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // Close mobile menu
  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

}