import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Project {
  emoji: string;
  title: string;
  desc: string;
  cat: string;
  catLabel: string;
  grad: string;
  tags: string[];
  result?: string;
  featured?: boolean;
}

interface Filter {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements AfterViewInit {
  @ViewChildren('reveal') reveals!: QueryList<ElementRef>;

  activeFilter = 'all';

  filters: Filter[] = [
    { label: 'All Projects', value: 'all',  icon: '🗂️' },
    { label: 'Websites',     value: 'web',  icon: '🌐' },
    { label: 'Mobile Apps',  value: 'app',  icon: '📱' },
    { label: 'E-Commerce',   value: 'ecom', icon: '🛒' },
    { label: 'UI/UX Design', value: 'uiux', icon: '🎨' },
  ];

  allProjects: Project[] = [
    {
      emoji: '🏢', title: 'Corporate Brand Site',
      desc: 'Multi-page company website with CMS, blog and lead generation funnels built on React.',
      cat: 'web', catLabel: 'Website',
      grad: 'linear-gradient(135deg, #3b1b4d 0%, #7a3d8c 100%)',
      tags: ['React', 'WordPress', 'SEO'],
      result: '3× more leads', featured: true,
    },
    {
      emoji: '🛍️', title: 'Fashion E-Store',
      desc: 'WooCommerce store with Paystack integration, inventory management and custom checkout.',
      cat: 'ecom', catLabel: 'E-Commerce',
      grad: 'linear-gradient(135deg, #4d9e55 0%, #3b1b4d 100%)',
      tags: ['WooCommerce', 'Paystack', 'PHP'],
      result: '₦2M+ monthly sales',
    },
    {
      emoji: '📦', title: 'Delivery Tracker App',
      desc: 'Flutter app with real-time GPS tracking, push notifications and driver management portal.',
      cat: 'app', catLabel: 'Mobile App',
      grad: 'linear-gradient(135deg, #1a0a2a 0%, #7a3d8c 100%)',
      tags: ['Flutter', 'Firebase', 'Google Maps'],
      result: '10k+ downloads', featured: true,
    },
    {
      emoji: '🏥', title: 'Healthcare Portal',
      desc: 'Patient management system with appointment booking, records and telemedicine support.',
      cat: 'web', catLabel: 'Website',
      grad: 'linear-gradient(135deg, #0a1a3a 0%, #3b1b4d 100%)',
      tags: ['Angular', 'Node.js', 'MongoDB'],
      result: '500+ patients onboarded',
    },
    {
      emoji: '💰', title: 'Fintech Wallet App',
      desc: 'Secure mobile banking app with biometric login, bill payments and card management.',
      cat: 'app', catLabel: 'Mobile App',
      grad: 'linear-gradient(135deg, #c9729a 0%, #3b1b4d 100%)',
      tags: ['React Native', 'Node.js', 'PostgreSQL'],
      result: '₦50M+ processed',
    },
    {
      emoji: '🍕', title: 'Restaurant Order System',
      desc: 'Online food ordering with real-time kitchen display, table reservations and delivery tracking.',
      cat: 'ecom', catLabel: 'E-Commerce',
      grad: 'linear-gradient(135deg, #3b1b4d 0%, #c9729a 100%)',
      tags: ['Next.js', 'Prisma', 'Stripe'],
      result: '200+ orders/day',
    },
    {
      emoji: '🎓', title: 'EdTech LMS Platform',
      desc: 'Full learning management system with video streaming, quizzes, certificates and student tracking.',
      cat: 'web', catLabel: 'Website',
      grad: 'linear-gradient(135deg, #0a2a2a 0%, #7a3d8c 100%)',
      tags: ['React', 'Django', 'AWS S3'],
      result: '2000+ learners',
    },
    {
      emoji: '💆', title: 'Wellness Booking App',
      desc: 'Spa and wellness appointment booking with Paystack payments and automated reminders.',
      cat: 'app', catLabel: 'Mobile App',
      grad: 'linear-gradient(135deg, #7a3d8c 0%, #e8a4c8 100%)',
      tags: ['Flutter', 'Firebase', 'Paystack'],
      result: '95% booking rate',
    },
    {
      emoji: '🏡', title: 'Real Estate Platform',
      desc: 'Property listings marketplace with advanced search, virtual tours and agent dashboard.',
      cat: 'web', catLabel: 'Website',
      grad: 'linear-gradient(135deg, #1a2a0a 0%, #3b1b4d 100%)',
      tags: ['Next.js', 'PostgreSQL', 'Mapbox'],
      result: '1000+ listings',
    },
    {
      emoji: '🎨', title: 'Brand Identity System',
      desc: 'Complete brand redesign including logo, colour palette, typography and UI component library.',
      cat: 'uiux', catLabel: 'UI/UX Design',
      grad: 'linear-gradient(135deg, #e8a4c8 0%, #7a3d8c 100%)',
      tags: ['Figma', 'Branding', 'Design System'],
      result: '40% better engagement',
    },
    {
      emoji: '🎵', title: 'Music Streaming App',
      desc: 'Nigerian music streaming app with offline playback, artist profiles and social sharing.',
      cat: 'app', catLabel: 'Mobile App',
      grad: 'linear-gradient(135deg, #2a0a1a 0%, #7a3d8c 100%)',
      tags: ['React Native', 'Node.js', 'AWS'],
      result: '5k+ active users',
    },
    {
      emoji: '🛒', title: 'Supermarket E-Commerce',
      desc: 'Full grocery e-commerce platform with same-day delivery, loyalty points and inventory sync.',
      cat: 'ecom', catLabel: 'E-Commerce',
      grad: 'linear-gradient(135deg, #0a2a0a 0%, #3b1b4d 100%)',
      tags: ['Shopify', 'Node.js', 'Paystack'],
      result: '₦5M+ monthly GMV', featured: true,
    },
  ];

  process = [
    { num: '01', icon: '💬', title: 'Discovery',    desc: 'We learn your brand, goals and audience through a free consultation session.' },
    { num: '02', icon: '✏️', title: 'Design',       desc: 'Wireframes and high-fidelity mockups crafted and reviewed before coding starts.' },
    { num: '03', icon: '⚙️', title: 'Build',        desc: 'Clean, scalable code built and tested across all devices and browsers.' },
    { num: '04', icon: '🚀', title: 'Launch',       desc: 'Smooth go-live with full QA, performance checks and post-launch support.' },
  ];

  testimonials = [
    { quote: 'Akiira Tech doubled our lead generation in just 3 months. Incredibly talented and professional team.', name: 'Adaeze Okonkwo', role: 'CEO, Lagos Fashion House', initials: 'AO', avGrad: 'linear-gradient(135deg, #3b1b4d, #6bbf73)' },
    { quote: 'Our mobile app was delivered ahead of schedule. The Flutter skills are genuinely world-class.', name: 'Emeka Bright', role: 'Founder, QuickDeliver NG', initials: 'EB', avGrad: 'linear-gradient(135deg, #c9729a, #3b1b4d)' },
    { quote: 'Organic traffic up 180% since we started. The SEO work Akiira Tech did was transformative.', name: 'Taiwo Makinde', role: 'Marketing Director, EduReach', initials: 'TM', avGrad: 'linear-gradient(135deg, #6bbf73, #3b1b4d)' },
  ];

  get filteredProjects(): Project[] {
    if (this.activeFilter === 'all') return this.allProjects;
    return this.allProjects.filter(p => p.cat === this.activeFilter);
  }

  getCount(value: string): number {
    if (value === 'all') return this.allProjects.length;
    return this.allProjects.filter(p => p.cat === value).length;
  }

  setFilter(f: string) {
    this.activeFilter = f;
  }

  ngAfterViewInit() {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    this.reveals.forEach(r => obs.observe(r.nativeElement));
  }
}