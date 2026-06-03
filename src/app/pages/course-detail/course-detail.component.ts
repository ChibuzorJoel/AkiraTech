import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Course {
  id: number;
  title: string;
  icon: string;
  duration: string;
  level: string;
  price: string;
  originalPrice: string;
  description: string;
  longDescription: string;
  features: string[];
  curriculum: { week: string; topics: string[] }[];
}

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: Course | undefined;
  userInfo: { name: string; email: string } | null = null;
  activeTab: 'overview' | 'curriculum' = 'overview';
  paymentProcessing = false;
  paymentSuccess = false;

  courses: Course[] = [
    {
      id: 1,
      title: 'Web Development (Full Stack)',
      icon: '🌐',
      duration: '16 weeks',
      level: 'Beginner',
      price: '₦250,000',
      originalPrice: '₦350,000',
      description: 'Master both frontend and backend development. Learn HTML, CSS, JavaScript, Angular, Node.js, MongoDB, and become a complete web developer.',
      longDescription: 'This comprehensive full-stack web development course is designed to take you from absolute beginner to job-ready developer. You will learn both frontend and backend technologies, build real-world projects, and understand how modern web applications are built from scratch.',
      features: [
        'Frontend: HTML, CSS, JavaScript, Angular',
        'Backend: Node.js, Express',
        'Database: MongoDB, MySQL',
        'Version Control: Git & GitHub',
        'Deployment & DevOps basics',
        'Real-world projects',
        'RESTful API Development',
        'Authentication & Authorization'
      ],
      curriculum: [
        { week: 'Weeks 1-3', topics: ['HTML5 & CSS3', 'Responsive Design', 'CSS Frameworks', 'JavaScript Fundamentals'] },
        { week: 'Weeks 4-6', topics: ['Advanced JavaScript', 'ES6+ Features', 'TypeScript Basics', 'Angular Framework'] },
        { week: 'Weeks 7-9', topics: ['Node.js & Express', 'RESTful APIs', 'Database Design', 'MongoDB'] },
        { week: 'Weeks 10-12', topics: ['Authentication', 'Security', 'Testing', 'Deployment'] },
        { week: 'Weeks 13-16', topics: ['Capstone Project', 'Portfolio Building', 'Job Preparation'] }
      ]
    },
    {
      id: 2,
      title: 'Frontend Development',
      icon: '🎨',
      duration: '12 weeks',
      level: 'Beginner',
      price: '₦180,000',
      originalPrice: '₦250,000',
      description: 'Learn to build beautiful, responsive websites. Master HTML, CSS, JavaScript, and modern frameworks like Angular and React.',
      longDescription: 'Focus specifically on frontend development. Learn to create stunning user interfaces, implement responsive designs, and work with modern JavaScript frameworks.',
      features: [
        'HTML5 & CSS3',
        'JavaScript (ES6+)',
        'Responsive Design',
        'Angular Framework',
        'React.js Basics',
        'UI/UX Principles'
      ],
      curriculum: [
        { week: 'Weeks 1-3', topics: ['HTML5 Fundamentals', 'CSS3 Styling', 'Flexbox & Grid'] },
        { week: 'Weeks 4-6', topics: ['JavaScript Basics', 'DOM Manipulation', 'Events & APIs'] },
        { week: 'Weeks 7-9', topics: ['Angular Introduction', 'Components & Services', 'Routing'] },
        { week: 'Weeks 10-12', topics: ['React Basics', 'State Management', 'Project Work'] }
      ]
    },
    {
      id: 3,
      title: 'Backend Development',
      icon: '⚙️',
      duration: '12 weeks',
      level: 'Intermediate',
      price: '₦200,000',
      originalPrice: '₦280,000',
      description: 'Build powerful server-side applications and APIs. Learn Node.js, Express, database management, and server architecture.',
      longDescription: 'Dive deep into server-side development. Learn to build scalable APIs, manage databases, implement security, and deploy applications to the cloud.',
      features: [
        'Node.js & Express',
        'RESTful APIs',
        'Database Design',
        'Authentication & Security',
        'Server Deployment',
        'Performance Optimization'
      ],
      curriculum: [
        { week: 'Weeks 1-3', topics: ['Node.js Fundamentals', 'NPM & Modules', 'Express Framework'] },
        { week: 'Weeks 4-6', topics: ['REST API Design', 'Middleware', 'Error Handling'] },
        { week: 'Weeks 7-9', topics: ['SQL Databases', 'MongoDB', 'Data Modeling'] },
        { week: 'Weeks 10-12', topics: ['Authentication', 'Security', 'Deployment', 'Testing'] }
      ]
    },
    {
      id: 4,
      title: 'Mobile App Development',
      icon: '📱',
      duration: '14 weeks',
      level: 'Beginner',
      price: '₦280,000',
      originalPrice: '₦380,000',
      description: 'Create cross-platform mobile apps for iOS and Android using Flutter and React Native.',
      longDescription: 'Learn to build production-ready mobile applications for both iOS and Android platforms using Flutter and React Native frameworks.',
      features: [
        'Flutter Framework',
        'Dart Programming',
        'React Native',
        'UI/UX for Mobile',
        'App Store Deployment',
        'Firebase Integration'
      ],
      curriculum: [
        { week: 'Weeks 1-4', topics: ['Flutter Basics', 'Dart Language', 'Widgets & Layout'] },
        { week: 'Weeks 5-8', topics: ['Navigation', 'State Management', 'API Integration'] },
        { week: 'Weeks 9-11', topics: ['Firebase Setup', 'Authentication', 'Cloud Storage'] },
        { week: 'Weeks 12-14', topics: ['Testing', 'App Store Submission', 'Capstone Project'] }
      ]
    },
    {
      id: 5,
      title: 'UI/UX Design',
      icon: '🎨',
      duration: '10 weeks',
      level: 'Beginner',
      price: '₦150,000',
      originalPrice: '₦220,000',
      description: 'Learn user-centered design principles. Master Figma, wireframing, prototyping, and create stunning user interfaces.',
      longDescription: 'Master the art of user interface and user experience design. Learn to create intuitive, beautiful, and user-friendly digital products.',
      features: [
        'Design Principles',
        'Figma Mastery',
        'Wireframing & Prototyping',
        'User Research',
        'Usability Testing',
        'Portfolio Development'
      ],
      curriculum: [
        { week: 'Weeks 1-3', topics: ['Design Fundamentals', 'Color Theory', 'Typography'] },
        { week: 'Weeks 4-6', topics: ['Figma Deep Dive', 'Wireframing', 'Prototyping'] },
        { week: 'Weeks 7-8', topics: ['User Research', 'Usability Testing', 'Design Systems'] },
        { week: 'Weeks 9-10', topics: ['Portfolio Projects', 'Case Studies', 'Job Preparation'] }
      ]
    },
    {
      id: 6,
      title: 'Data analysis',
      icon: '📊',
      duration: '12 weeks',
      level: 'Beginner',
      price: '₦200,000',
      originalPrice: '₦280,000',
      description: 'Learn to collect, process, and analyze data. Master Excel, SQL, Python, and data visualization tools.',
      longDescription: 'Become a data-driven professional. Learn to extract insights from data using industry-standard tools and techniques.',
      features: [
        'Excel Advanced',
        'SQL for Data',
        'Python for Data Analysis',
        'Data Visualization',
        'Statistical Analysis',
        'Business Intelligence'
      ],
      curriculum: [
        { week: 'Weeks 1-3', topics: ['Excel Fundamentals', 'Data Cleaning', 'Pivot Tables'] },
        { week: 'Weeks 4-6', topics: ['SQL Basics', 'Querying Databases', 'Joins & Subqueries'] },
        { week: 'Weeks 7-9', topics: ['Python for Data', 'Pandas & NumPy', 'Data Visualization'] },
        { week: 'Weeks 10-12', topics: ['Statistical Analysis', 'Business Intelligence', 'Capstone Project'] }
      ]
    },
    {
      id: 7,
      title: 'Virtual assistance',
      icon: '💼',
      duration: '8 weeks',
      level: 'Beginner',
      price: '₦100,000',
      originalPrice: '₦150,000',
      description: 'Become a professional virtual assistant. Learn administrative tasks, communication tools, and client management.',
      longDescription: 'Start your career as a virtual assistant. Learn essential skills to support businesses remotely and build a successful VA business.',
      features: [
        'Administrative Skills',
        'Calendar & Email Management',
        'Communication Tools',
        'Project Management',
        'Social Media Management',
        'Client Relations'
      ],
      curriculum: [
        { week: 'Weeks 1-2', topics: ['VA Fundamentals', 'Tools Overview', 'Setting Up Your Business'] },
        { week: 'Weeks 3-4', topics: ['Email Management', 'Calendar Management', 'Communication Tools'] },
        { week: 'Weeks 5-6', topics: ['Project Management', 'Social Media Management', 'Client Relations'] },
        { week: 'Weeks 7-8', topics: ['Finding Clients', 'Pricing Strategies', 'Building Your Brand'] }
      ]
    },
    {
      id: 8,
      title: 'Copywriting and CV writing',
      icon: '✍️',
      duration: '6 weeks',
      level: 'Beginner',
      price: '₦80,000',
      originalPrice: '₦120,000',
      description: 'Master the art of persuasive writing. Learn copywriting for marketing and professional CV writing.',
      longDescription: 'Learn to write compelling copy that converts and professional CVs that land interviews.',
      features: [
        'Copywriting Fundamentals',
        'Persuasive Writing',
        'SEO Copywriting',
        'CV & Resume Writing',
        'Cover Letter Writing',
        'LinkedIn Profile Optimization'
      ],
      curriculum: [
        { week: 'Week 1-2', topics: ['Copywriting Basics', 'Headlines & Hooks', 'Persuasive Techniques'] },
        { week: 'Week 3-4', topics: ['SEO Copywriting', 'Email Marketing', 'Sales Pages'] },
        { week: 'Week 5-6', topics: ['CV Writing', 'Cover Letters', 'LinkedIn Optimization'] }
      ]
    },
    {
      id: 9,
      title: 'Social media management',
      icon: '📱',
      duration: '8 weeks',
      level: 'Beginner',
      price: '₦120,000',
      originalPrice: '₦180,000',
      description: 'Learn to manage social media accounts for businesses. Master content creation, scheduling, and analytics.',
      longDescription: 'Become a certified social media manager. Learn to grow audiences, create engaging content, and drive results for businesses.',
      features: [
        'Content Strategy',
        'Content Creation',
        'Social Media Tools',
        'Analytics & Reporting',
        'Community Management',
        'Paid Advertising Basics'
      ],
      curriculum: [
        { week: 'Weeks 1-2', topics: ['Platform Overview', 'Content Strategy', 'Brand Voice'] },
        { week: 'Weeks 3-4', topics: ['Content Creation', 'Canva Mastery', 'Video Basics'] },
        { week: 'Weeks 5-6', topics: ['Scheduling Tools', 'Community Management', 'Analytics'] },
        { week: 'Weeks 7-8', topics: ['Paid Ads Basics', 'Client Management', 'Portfolio Building'] }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const courseId = +params['id'];
      this.course = this.courses.find(c => c.id === courseId);
      
      if (!this.course) {
        this.router.navigate(['/courses']);
      }
    });
    
    // Get user info from query params or localStorage
    this.route.queryParams.subscribe(params => {
      if (params['name'] && params['email']) {
        this.userInfo = { name: params['name'], email: params['email'] };
      } else {
        const pendingReg = localStorage.getItem('pendingRegistration');
        if (pendingReg) {
          const regData = JSON.parse(pendingReg);
          this.userInfo = { name: regData.fullName, email: regData.email };
        }
      }
    });
  }

  setActiveTab(tab: 'overview' | 'curriculum') {
    this.activeTab = tab;
  }

  processPayment() {
    this.paymentProcessing = true;
    
    // Here you would integrate Paystack or Flutterwave
    // For now, simulate payment processing
    setTimeout(() => {
      this.paymentProcessing = false;
      this.paymentSuccess = true;
      
      // Clear pending registration
      localStorage.removeItem('pendingRegistration');
      
      // Send to Formspree
      const pendingReg = localStorage.getItem('pendingRegistration');
      if (pendingReg) {
        const regData = JSON.parse(pendingReg);
        const formData = {
          ...regData,
          course: this.course?.title,
          price: this.course?.price,
          paymentStatus: 'completed',
          submittedAt: new Date().toISOString()
        };
        
        this.http.post('https://formspree.io/f/xjgppopv', formData).subscribe();
      }
    }, 2000);
  }

  goToWhatsApp() {
    const message = `Hello Akiira Tech! I'm interested in the ${this.course?.title} course. My name is ${this.userInfo?.name || 'a prospective student'}. Please send me more information.`;
    window.open(`https://wa.me/2349021706710?text=${encodeURIComponent(message)}`, '_blank');
  }

  goBack() {
    this.router.navigate(['/register']);
  }
}