import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements AfterViewInit {
  @ViewChildren('reveal') reveals!: QueryList<ElementRef>;

  process = [
    { n:'01', icon:'💬', t:'Discovery',   d:'We learn your brand, goals and target audience inside out — free consultation.' },
    { n:'02', icon:'🗺️', t:'Planning',    d:'Detailed project plan, timeline, tech stack and design direction agreed upfront.' },
    { n:'03', icon:'✏️', t:'Design',      d:'Wireframes and high-fidelity mockups you review and approve before coding begins.' },
    { n:'04', icon:'⚙️', t:'Build',       d:'Clean, scalable code tested across all devices, browsers and screen sizes.' },
    { n:'05', icon:'🧪', t:'Test & Launch',d:'Rigorous QA before a smooth, stress-free go-live with zero surprises.' },
    { n:'06', icon:'🤝', t:'Support',     d:'We remain your long-term partner — available for updates and growth after launch.' },
  ];

  faq = [
    { q:'How long does a website take to build?',       a:'Most websites take 2–4 weeks depending on complexity. We provide a detailed timeline during your free consultation.' },
    { q:'Do you offer payment in instalments?',          a:'Yes! We split payments 50% upfront and 50% on delivery. Custom plans are available for larger projects.' },
    { q:'Can I update my website myself after launch?',  a:'Absolutely. We build with user-friendly CMS tools and provide training so you can manage content confidently.' },
    { q:'Do you work with clients outside Nigeria?',     a:'Yes! We work with clients across Africa and globally. All communication is handled online.' },
    { q:'What do I need to get started?',               a:'Just your goals, audience and any inspiration you have. We guide you through the rest in a discovery session.' },
    { q:'Do you provide hosting and domain services?',   a:'We can set up hosting for you or work with your existing provider. Domain registration assistance is included.' },
  ];

  ngAfterViewInit() {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    this.reveals.forEach(r => obs.observe(r.nativeElement));
  }
}
