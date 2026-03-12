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
  }

}