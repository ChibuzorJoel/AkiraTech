import { Component, OnInit, Output, EventEmitter } from '@angular/core';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export type CookieKey = keyof CookiePreferences;

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.css']
})
export class CookieBannerComponent implements OnInit {

  @Output() preferencesSet = new EventEmitter<CookiePreferences>();

  isVisible = false;
  showDetails = false;

  preferences: CookiePreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  };

  cookieTypes: {
    key: CookieKey;
    label: string;
    icon: string;
    description: string;
    examples: string;
    alwaysOn: boolean;
  }[] = [
    {
      key: 'necessary',
      label: 'Strictly Necessary',
      icon: '🔒',
      description: 'Required for the website to function properly. Cannot be disabled.',
      examples: 'Session tokens, security cookies, CSRF protection',
      alwaysOn: true
    },
    {
      key: 'analytics',
      label: 'Analytics',
      icon: '📊',
      description: 'Help us understand how visitors interact with our website so we can improve it.',
      examples: 'Google Analytics (page views, traffic sources, visit duration)',
      alwaysOn: false
    },
    {
      key: 'functional',
      label: 'Functional',
      icon: '⚙️',
      description: 'Enable enhanced features like live chat and remembering your preferences.',
      examples: 'Chat widget preferences, language settings',
      alwaysOn: false
    },
    {
      key: 'marketing',
      label: 'Marketing',
      icon: '📢',
      description: 'Used to track visitors across websites to display relevant advertisements.',
      examples: 'Facebook Pixel, Google Ads remarketing',
      alwaysOn: false
    }
  ];

  ngOnInit(): void {
    const saved = localStorage.getItem('akiira_cookie_consent');

    if (!saved) {
      setTimeout(() => this.isVisible = true, 800);
    } else {
      this.preferences = JSON.parse(saved);
      this.preferencesSet.emit(this.preferences);
    }
  }

  acceptAll(): void {
    this.preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };

    this.save();
  }

  rejectAll(): void {
    this.preferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };

    this.save();
  }

  saveCustom(): void {
    this.save();
  }

  togglePreference(key: CookieKey): void {
    if (key === 'necessary') return;

    this.preferences[key] = !this.preferences[key];
  }

  isPreferenceEnabled(key: CookieKey): boolean {
    return this.preferences[key];
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  open(): void {
    const saved = localStorage.getItem('akiira_cookie_consent');

    if (saved) {
      this.preferences = JSON.parse(saved);
    }

    this.isVisible = true;
  }

  private save(): void {
    localStorage.setItem(
      'akiira_cookie_consent',
      JSON.stringify(this.preferences)
    );

    localStorage.setItem(
      'akiira_cookie_date',
      new Date().toISOString()
    );

    this.preferencesSet.emit(this.preferences);
    this.isVisible = false;
  }
}