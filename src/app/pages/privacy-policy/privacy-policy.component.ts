import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent {
  lastUpdated = 'June 1, 2025';
  companyName = 'Akiira Tech';
  companyEmail = 'info@akiira-tech.com';

  activeSection: string = '';

  sections = [
    {
      id: 'information-we-collect',
      title: '1. Information We Collect',
      icon: '📋',
      content: `We collect information you provide directly to us and information collected automatically when you use our services.`,
      subsections: [
        {
          subtitle: 'Information You Provide',
          items: [
            'Name, email address, phone number when you fill out contact forms',
            'Business name and project details when requesting our services',
            'Payment information processed securely via third-party processors (e.g., Paystack)',
            'Communications you send us via email, WhatsApp, or our contact form'
          ]
        },
        {
          subtitle: 'Information Collected Automatically',
          items: [
            'IP address, browser type, and operating system',
            'Pages visited, time spent on pages, and referring URLs',
            'Device identifiers and cookie data',
            'General geographic location based on IP address'
          ]
        }
      ]
    },
    {
      id: 'how-we-use',
      title: '2. How We Use Your Information',
      icon: '⚙️',
      content: 'We use the information we collect for the following purposes:',
      subsections: [
        {
          subtitle: '',
          items: [
            'To provide, maintain, and improve our web and app development services',
            'To respond to your inquiries and communicate about your projects',
            'To process payments and send transactional emails (invoices, receipts)',
            'To send marketing communications where you have opted in',
            'To analyse website usage and improve user experience',
            'To comply with Nigerian law and regulatory obligations under the NDPR'
          ]
        }
      ]
    },
    {
      id: 'legal-basis',
      title: '3. Legal Basis for Processing (NDPR)',
      icon: '⚖️',
      content: 'Under the Nigeria Data Protection Regulation (NDPR) 2019, we process your personal data on the following lawful bases:',
      subsections: [
        {
          subtitle: '',
          items: [
            'Consent — where you have given clear consent for us to process your data',
            'Contract — where processing is necessary to perform a contract with you',
            'Legal obligation — where processing is required by Nigerian law',
            'Legitimate interests — where we have a legitimate business interest that does not override your rights'
          ]
        }
      ]
    },
    {
      id: 'data-sharing',
      title: '4. How We Share Your Information',
      icon: '🤝',
      content: 'We do not sell, rent, or trade your personal data. We may share it only in the following circumstances:',
      subsections: [
        {
          subtitle: '',
          items: [
            'Service providers: trusted third parties (e.g., Paystack, Google Analytics, hosting providers)',
            'Legal compliance: if required by Nigerian law, court order, or government authority',
            'Business transfers: in the event of a merger, acquisition, or sale of assets',
            'With your consent: for any other purpose with your explicit consent'
          ]
        }
      ]
    },
    {
      id: 'data-retention',
      title: '5. Data Retention',
      icon: '🗓️',
      content: 'We retain your personal data only for as long as necessary:',
      subsections: [
        {
          subtitle: '',
          items: [
            'Client project data: retained for 5 years after project completion for legal and accounting purposes',
            'Contact form submissions: retained for 12 months unless a business relationship develops',
            'Website analytics data: retained for 26 months (standard Google Analytics retention)',
            'Marketing email lists: retained until you unsubscribe or request deletion'
          ]
        }
      ]
    },
    {
      id: 'your-rights',
      title: '6. Your Rights Under the NDPR',
      icon: '🛡️',
      content: 'As a data subject under the NDPR, you have the following rights:',
      subsections: [
        {
          subtitle: '',
          items: [
            'Right to access: request a copy of your personal data we hold',
            'Right to rectification: request correction of inaccurate or incomplete data',
            'Right to erasure ("right to be forgotten"): request deletion of your data',
            'Right to restrict processing: request we limit how we use your data',
            'Right to data portability: receive your data in a structured, machine-readable format',
            'Right to object: object to processing based on legitimate interests or for direct marketing',
            'Right to withdraw consent: at any time, without affecting prior processing'
          ]
        }
      ]
    },
    {
      id: 'cookies',
      title: '7. Cookies',
      icon: '🍪',
      content: 'We use cookies and similar tracking technologies to enhance your experience on our website. You can manage your cookie preferences at any time via our Cookie Consent Banner.',
      subsections: []
    },
    {
      id: 'security',
      title: '8. Data Security',
      icon: '🔒',
      content: 'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure.',
      subsections: []
    },
    {
      id: 'third-party',
      title: '9. Third-Party Links',
      icon: '🔗',
      content: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices of those websites and encourage you to review their privacy policies independently.',
      subsections: []
    },
    {
      id: 'children',
      title: "10. Children's Privacy",
      icon: '👦',
      content: 'Our services are not directed at children under 18 years of age. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected such data, please contact us immediately.',
      subsections: []
    },
    {
      id: 'changes',
      title: '11. Changes to This Policy',
      icon: '📝',
      content: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated "Last Updated" date.',
      subsections: []
    },
    {
      id: 'contact',
      title: '12. Contact Us',
      icon: '📞',
      content: 'For any privacy-related questions, requests, or complaints, please contact our Data Protection Officer:',
      subsections: [
        {
          subtitle: '',
          items: [
            'Email: privacy@akiira-tech.com',
            'Address: Akiira Tech, Nigeria',
            "You also have the right to lodge a complaint with NITDA — Nigeria's data protection authority."
          ]
        }
      ]
    }
  ];

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection = id;
    }
  }
}