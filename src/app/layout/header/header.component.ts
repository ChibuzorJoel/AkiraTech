import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  isScrolled  = false;
  // Mobile menu state
  isMenuOpen: boolean = false;


  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 10;
  }


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
  ngOnInit() {}
  ngOnDestroy() { document.body.style.overflow = ''; }
}