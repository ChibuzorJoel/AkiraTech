import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  // If you're NOT using standalone, remove the imports array above
  // and keep only:
  // @Component({ selector: 'app-home', templateUrl: ..., styleUrls: ... })
  // export class HomeComponent implements AfterViewInit { ... }

  @ViewChildren('reveal') revealEls!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    this.initRevealAnimations();
  }

  private initRevealAnimations(): void {
    // Fallback: if no @ViewChildren elements, use querySelectorAll
    const elements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach(el => observer.observe(el));
  }
}