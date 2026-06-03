import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-refund-policy',
  templateUrl: './refund-policy.component.html',
  styleUrls: ['./refund-policy.component.css']
})
export class RefundPolicyComponent {
  lastUpdated = 'June 1, 2025';
  companyName = 'Akiira Tech';
  companyEmail = 'info@akiira-tech.com';

  highlights = [
    {
      icon: '💸',
      label: 'Deposit',
      value: '50% Non-Refundable',
      note: 'Required to begin all projects'
    },
    {
      icon: '🔁',
      label: 'Cancellation Window',
      value: '48 Hours',
      note: 'After kickoff call, full refund of balance'
    },
    {
      icon: '🛠️',
      label: 'Dispute Resolution',
      value: '14 Days',
      note: 'For raising any project concerns'
    },
    {
      icon: '✅',
      label: 'Post-Launch Support',
      value: '30 Days',
      note: 'Bug-fix warranty included'
    }
  ];

  scenarios = [
    {
      situation: 'Project cancelled before work begins',
      outcome: 'Full refund of all payments',
      type: 'full'
    },
    {
      situation: 'Project cancelled within 48 hours of kickoff',
      outcome: 'Full refund of balance (deposit retained)',
      type: 'partial'
    },
    {
      situation: 'Project cancelled mid-development (< 50% complete)',
      outcome: 'Balance refunded minus completed milestone value',
      type: 'partial'
    },
    {
      situation: 'Project cancelled at 50%+ completion',
      outcome: 'No refund; deliverables provided up to that point',
      type: 'none'
    },
    {
      situation: 'Significant scope change requested by client',
      outcome: 'No refund; re-quoting applies to new scope',
      type: 'none'
    },
    {
      situation: 'Technical failure or error on our part',
      outcome: 'Full refund or no-cost remedy at client\'s choice',
      type: 'full'
    },
    {
      situation: 'Delay beyond agreed timeline (our fault)',
      outcome: 'Partial refund proportional to delay, or expedited delivery',
      type: 'partial'
    },
    {
      situation: 'Client fails to provide required assets/feedback',
      outcome: 'No refund; project paused until assets received',
      type: 'none'
    }
  ];

  faqs = [
    {
      q: 'Can I get a refund after the final delivery?',
      a: 'No. Once a project has been delivered and signed off, refunds are not applicable. We offer a 30-day post-launch bug-fix window at no charge for any technical issues arising from our work.',
      open: false
    },
    {
      q: 'What counts as a "milestone" in milestone-based payments?',
      a: 'Milestones are agreed upon in your project proposal and may include: wireframe delivery, design approval, frontend development, backend integration, and final launch. Each milestone is invoiced and non-refundable once approved.',
      open: false
    },
    {
      q: 'How do I initiate a refund request?',
      a: 'Email hello@akiira-tech.com with your project reference number and reason for the request. We will acknowledge within 2 business days and resolve within 10 business days.',
      open: false
    },
    {
      q: 'What payment methods support refunds?',
      a: 'Refunds are issued via the same channel payment was received. Bank transfers: 3-5 business days. Paystack: 5-10 business days depending on your bank.',
      open: false
    },
    {
      q: 'Is the domain/hosting cost refundable?',
      a: 'No. Third-party costs such as domain registration, hosting fees, SSL certificates, and licensed software are non-refundable as they are purchased on your behalf from external vendors.',
      open: false
    }
  ];

  toggleFaq(faq: any) {
    faq.open = !faq.open;
  }
}
