import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {

  @ViewChildren('reveal') revealEls!: QueryList<ElementRef>;

  // Cookie consent variables
  showCookieConsent = false;
  showCookieSettings = false;
  showCookiePolicy = false;
  
  cookiePreferences = {
    analytics: true,
    functional: true,
    marketing: false
  };

  ngOnInit(): void {
    // Initialize video autoplay when component loads
    this.initVideoAutoplay();
    // Check cookie consent
    this.checkCookieConsent();
  }

  ngAfterViewInit(): void {
    this.initRevealAnimations();
  }

  private checkCookieConsent(): void {
    // Check if user has already made a cookie choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    if (!cookieChoice) {
      // Show cookie consent popup after 1 second
      setTimeout(() => {
        this.showCookieConsent = true;
      }, 1000);
    } else {
      // Load saved preferences
      const savedPrefs = localStorage.getItem('cookiePreferences');
      if (savedPrefs) {
        this.cookiePreferences = JSON.parse(savedPrefs);
      }
      this.applyCookiePreferences();
    }
  }

  acceptCookies(): void {
    // Accept all cookies
    this.cookiePreferences = {
      analytics: true,
      functional: true,
      marketing: true
    };
    this.saveCookiePreferences();
    this.showCookieConsent = false;
  }

  declineCookies(): void {
    // Only essential cookies (disable all optional)
    this.cookiePreferences = {
      analytics: false,
      functional: false,
      marketing: false
    };
    this.saveCookiePreferences();
    this.showCookieConsent = false;
  }

  openCookieSettings(): void {
    this.showCookieSettings = true;
    document.body.style.overflow = 'hidden';
  }

  closeCookieSettings(): void {
    this.showCookieSettings = false;
    document.body.style.overflow = '';
  }

  saveCookiePreferences(): void {
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(this.cookiePreferences));
    this.applyCookiePreferences();
    this.closeCookieSettings();
  }

  acceptAllCookies(): void {
    this.cookiePreferences = {
      analytics: true,
      functional: true,
      marketing: true
    };
    this.saveCookiePreferences();
  }

  private applyCookiePreferences(): void {
    // Apply Google Analytics based on preference
    if (this.cookiePreferences.analytics) {
      // Initialize Google Analytics or enable tracking
      console.log('Analytics cookies enabled');
      // You can add your GA initialization code here
      // Example: gtag('consent', 'update', { analytics_storage: 'granted' });
    } else {
      // Disable analytics tracking
      console.log('Analytics cookies disabled');
      // You can add GA opt-out code here
      // Example: gtag('consent', 'update', { analytics_storage: 'denied' });
    }
    
    // Apply functional cookies preference
    if (this.cookiePreferences.functional) {
      console.log('Functional cookies enabled');
    } else {
      console.log('Functional cookies disabled');
    }
    
    // Apply marketing cookies preference
    if (this.cookiePreferences.marketing) {
      console.log('Marketing cookies enabled');
      // Example: gtag('consent', 'update', { ad_storage: 'granted' });
    } else {
      console.log('Marketing cookies disabled');
      // Example: gtag('consent', 'update', { ad_storage: 'denied' });
    }
  }

  openCookiePolicy(event: Event): void {
    event.preventDefault();
    this.showCookiePolicy = true;
    document.body.style.overflow = 'hidden';
  }

  closeCookiePolicy(): void {
    this.showCookiePolicy = false;
    document.body.style.overflow = '';
  }

  private initVideoAutoplay(): void {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const video = document.querySelector('.hero-video-background') as HTMLVideoElement;
      
      if (video) {
        // Ensure video is muted (required for autoplay)
        video.muted = true;
        
        // Set playsinline attribute if not already set
        video.setAttribute('playsinline', '');
        
        // Try to play the video
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video playing automatically');
            })
            .catch((error) => {
              console.log('Autoplay prevented:', error);
              // Video won't autoplay, but we won't add a play button
              // You can optionally set a fallback image here
              this.setFallbackImage();
            });
        }
        
        // Handle video errors
        video.addEventListener('error', (e) => {
          console.error('Video error:', e);
          this.setFallbackImage();
        });
        
        // Handle when video data is loaded
        video.addEventListener('loadeddata', () => {
          console.log('Video loaded successfully');
          video.style.opacity = '1';
        });
      } else {
        console.log('Video element not found');
        this.setFallbackImage();
      }
    }, 100);
  }

  private setFallbackImage(): void {
    // Optional: Set a fallback image if video fails to play
    const hero = document.querySelector('.hero');
    if (hero && !hero.classList.contains('video-fallback')) {
      hero.classList.add('video-fallback');
    }
  }

  private initRevealAnimations(): void {
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