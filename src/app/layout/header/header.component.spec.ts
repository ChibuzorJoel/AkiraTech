import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  // Mobile menu 
  isMenuOpen: boolean = false;

  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  
  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

}