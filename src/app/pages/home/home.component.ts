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

  ngOnInit(): void {
    // Initialize video autoplay when component loads
    this.initVideoAutoplay();
  }

  ngAfterViewInit(): void {
    this.initRevealAnimations();
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