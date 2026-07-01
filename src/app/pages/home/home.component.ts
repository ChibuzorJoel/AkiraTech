import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// Declare gtag and fbq to avoid TypeScript errors
declare global {
  interface Window {
    gtag: any;
    fbq: any;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {

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

  // Advert data with tracking
  currentSlide = 0;
  adverts = [
    { 
      id: 1, 
      title: 'Brand Mission',
      name: 'brand_advert',
      link: '/contact',
      badge: '✨ Our Mission',
      badgeClass: '',
      ctaText: "Let's Build Together →"
    },
    { 
      id: 2, 
      title: 'Product Validation',
      name: 'validation_advert',
      link: 'https://forms.gle/m3FKzyGkdRxbJLxHA',
      badge: '🔥 New Service',
      badgeClass: 'proof',
      ctaText: 'Start Validation →'
    }
  ];
  private slideInterval: any;

  // Tracking variables
  private impressions: { [key: string]: number } = {};
  private clicks: { [key: string]: number } = {};
  private slideStartTime: number = 0;
  private viewDuration: { [key: string]: number } = {};

  ngOnInit(): void {
    // Initialize video autoplay when component loads
    this.initVideoAutoplay();
    // Check cookie consent
    this.checkCookieConsent();
    // Initialize ad tracking
    this.initAdTracking();
    // Start advert slider auto-slide
    this.startSlideInterval();
  }

  ngOnDestroy(): void {
    // Clear interval when component is destroyed
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    // Send final tracking data
    this.sendFinalAnalytics();
  }

  ngAfterViewInit(): void {
    this.initRevealAnimations();
  }

  // ── Ad Tracking Methods ──

  initAdTracking(): void {
    // Initialize tracking data
    this.adverts.forEach(ad => {
      this.impressions[ad.name] = 0;
      this.clicks[ad.name] = 0;
      this.viewDuration[ad.name] = 0;
    });

    // Track initial slide impression
    setTimeout(() => {
      this.trackImpression(this.adverts[0].name);
    }, 1000);

    // Record start time for first slide
    this.slideStartTime = Date.now();
  }

  trackImpression(adName: string): void {
    if (!adName || !this.cookiePreferences.analytics) return;
    
    // Record end time for previous slide
    if (this.slideStartTime > 0 && this.adverts.length > 0) {
      const previousAd = this.adverts[this.currentSlide]?.name;
      if (previousAd) {
        const duration = (Date.now() - this.slideStartTime) / 1000;
        this.viewDuration[previousAd] = (this.viewDuration[previousAd] || 0) + duration;
      }
    }

    // Increment impression count
    this.impressions[adName] = (this.impressions[adName] || 0) + 1;
    
    // Reset start time for new slide
    this.slideStartTime = Date.now();

    // Send to analytics
    this.sendAnalytics('impression', adName, {
      total_impressions: this.impressions[adName],
      duration: this.viewDuration[adName] || 0
    });

    console.log(`📊 Ad Impression: ${adName} (${this.impressions[adName]} views)`);
  }

  trackClick(adName: string): void {
    if (!adName) return;
    
    // Increment click count
    this.clicks[adName] = (this.clicks[adName] || 0) + 1;
    
    // Calculate CTR (Click-Through Rate)
    const impressions = this.impressions[adName] || 1;
    const ctr = ((this.clicks[adName] / impressions) * 100).toFixed(2);

    // Send to analytics
    this.sendAnalytics('click', adName, {
      total_clicks: this.clicks[adName],
      ctr: `${ctr}%`,
      impressions: impressions
    });

    console.log(`🖱️ Ad Click: ${adName} (${this.clicks[adName]} clicks, CTR: ${ctr}%)`);
  }

  sendAnalytics(eventType: string, adName: string, data?: any): void {
    // Skip if analytics cookies are disabled
    if (!this.cookiePreferences.analytics) {
      console.log('📊 Analytics disabled - skipping ad tracking');
      return;
    }

    const eventData = {
      event: 'ad_interaction',
      ad_name: adName,
      event_type: eventType,
      timestamp: new Date().toISOString(),
      current_slide: this.currentSlide,
      ...data
    };

    // Send to Google Analytics (if GA is installed)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ad_interaction', {
        'ad_name': adName,
        'event_type': eventType,
        'total_clicks': this.clicks[adName] || 0,
        'total_impressions': this.impressions[adName] || 0
      });
    }

    // Send to Facebook/Meta Pixel (if installed)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      if (eventType === 'click') {
        (window as any).fbq('track', 'Lead', {
          content_name: adName,
          content_category: 'Advert'
        });
      } else if (eventType === 'impression') {
        (window as any).fbq('track', 'ViewContent', {
          content_name: adName,
          content_category: 'Advert'
        });
      }
    }

    // Store in localStorage for session tracking
    const trackingData = localStorage.getItem('adTrackingData');
    const allData = trackingData ? JSON.parse(trackingData) : {};
    if (!allData[adName]) {
      allData[adName] = { impressions: 0, clicks: 0 };
    }
    if (eventType === 'impression') {
      allData[adName].impressions = (allData[adName].impressions || 0) + 1;
    }
    if (eventType === 'click') {
      allData[adName].clicks = (allData[adName].clicks || 0) + 1;
    }
    localStorage.setItem('adTrackingData', JSON.stringify(allData));

    console.log('📊 Ad Analytics:', eventData);
  }

  sendFinalAnalytics(): void {
    // Send final analytics on page unload
    const summary = {
      event: 'ad_session_end',
      timestamp: new Date().toISOString(),
      total_impressions: this.impressions,
      total_clicks: this.clicks,
      view_duration: this.viewDuration
    };

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ad_session_end', {
        'total_impressions': JSON.stringify(this.impressions),
        'total_clicks': JSON.stringify(this.clicks)
      });
    }

    console.log('📊 Final Ad Analytics:', summary);
  }

  // ── Advert Slider methods ──

  startSlideInterval(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.adverts.length;
    
    // Track impression for new slide
    setTimeout(() => {
      this.trackImpression(this.adverts[this.currentSlide].name);
    }, 500);
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.adverts.length) % this.adverts.length;
    
    // Track impression for new slide
    setTimeout(() => {
      this.trackImpression(this.adverts[this.currentSlide].name);
    }, 500);
  }

  goToSlide(index: number): void {
    if (this.currentSlide === index) return;
    this.currentSlide = index;
    
    // Reset auto-slide timer when user manually navigates
    clearInterval(this.slideInterval);
    this.startSlideInterval();
    
    // Track impression
    setTimeout(() => {
      this.trackImpression(this.adverts[index].name);
    }, 500);
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
    } else {
      // Disable analytics tracking
      console.log('Analytics cookies disabled');
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
    } else {
      console.log('Marketing cookies disabled');
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