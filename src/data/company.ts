import { Company } from '@/types';

export const company: Company = {
  id: '1',
  name: 'TechCorp Solutions',
  industry: 'Technology',
  size: '500-1000',
  location: 'San Francisco, CA',
  website: 'https://techcorp.com',
  description: 'A leading technology company specializing in AI and cloud solutions',
  logo: '/logos/techcorp.png',
  foundedYear: 2010,
  techStack: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'],
  benefits: [
    'Health Insurance',
    '401(k) Matching',
    'Flexible Work Hours',
    'Remote Work Options',
    'Professional Development',
    'Gym Membership'
  ],
  companyCulture: [
    'Innovation-driven',
    'Collaborative',
    'Inclusive',
    'Work-life Balance',
    'Continuous Learning'
  ],
  socialMedia: {
    linkedin: 'https://linkedin.com/company/techcorp',
    twitter: 'https://twitter.com/techcorp',
    facebook: 'https://facebook.com/techcorp'
  },
  contact: {
    email: 'careers@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, San Francisco, CA 94105'
  },
  settings: {
    notificationPreferences: {
      email: true,
      push: true,
      sms: false
    },
    interviewPreferences: {
      duration: 60,
      bufferTime: 15,
      timezone: 'America/Los_Angeles'
    },
    assessmentPreferences: {
      autoScoring: true,
      plagiarismCheck: true
    }
  }
}; 