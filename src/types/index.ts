export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  department: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  postedDate: string;
  status: 'Active' | 'Closed' | 'Draft';
  hiringManager: string;
  recruiter: string;
  pipeline: {
    stages: RecruitmentStage[];
  };
  skills?: string[];
  benefits?: string[];
}

export interface Skill {
  name: string;
  proficiency: number;
}

export interface CommunicationEvent {
  id: string;
  date: string;
  time: string;
  type: 'email' | 'phone' | 'whatsapp' | 'linkedin' | 'system' | 'calendar' | 'assessment' | 'interview';
  channel: string;
  subject: string;
  content: string;
  direction: 'inbound' | 'outbound' | 'system';
  status: 'sent' | 'delivered' | 'read' | 'completed' | 'scheduled';
  sender?: string;
  recipient?: string;
  attachments?: Array<{
    name: string;
    type: string;
    size: string;
  }>;
  metadata?: {
    [key: string]: any;
  };
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  currentTitle: string;
  currentCompany: string;
  location: string;
  experience: number;
  skills: Skill[] | string[]; // Support both formats for backward compatibility
  education: Education[];
  resume: string;
  source: string;
  appliedDate: string;
  stage: RecruitmentStage;
  jobId: string;
  notes?: string;
  assessment?: Assessment;
  skillCompetencies?: Skill[]; // Optional dedicated field for skill competencies
  interview?: Interview; // Add interview property
  lastUpdated?: string; // Add lastUpdated property
  communicationTimeline?: CommunicationEvent[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  category: 'Interview' | 'Coordination' | 'Update';
}

export interface DashboardMetrics {
  activeJobs: number;
  newApplications: number;
  shortlistedCandidates: number;
  topRankingCandidates: number;
}

export interface Interview {
  id: number;
  candidate: {
    name: string;
    position: string;
  };
  date: string;
  time: string;
  type: 'Technical' | 'Behavioral' | 'HR';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  interviewers: string[];
  location: string;
  transcript: {
    timestamp: string;
    speaker: 'Interviewer' | 'Candidate';
    content: string;
  }[];
  aiAssessment: {
    overallScore: number;
    categoryScores: {
      technical: number;
      communication: number;
      problemSolving: number;
      culturalFit: number;
    };
    strengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
  };
  humanFeedback: {
    score: number;
    notes: string;
    nextSteps: string;
    decision: 'Hire' | 'Reject' | 'Further Evaluation';
  };
}

export interface InterviewNotes {
  transcript: string;
  aiScore: number;
  humanScore: number;
  feedback: {
    [key: string]: string;
  };
}

export interface Notification {
  id: string;
  type: 'application' | 'interview' | 'job' | 'message';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
}

export interface CompanyInfo {
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  description: string;
  contactEmail: string;
  foundedYear: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SupportChannel {
  title: string;
  description: string;
  icon: React.ReactNode;
  contact: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  description: string;
  logo: string;
  foundedYear: number;
  techStack: string[];
  benefits: string[];
  companyCulture: string[];
  socialMedia: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  settings: {
    notificationPreferences: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    interviewPreferences: {
      duration: number;
      bufferTime: number;
      timezone: string;
    };
    assessmentPreferences: {
      autoScoring: boolean;
      plagiarismCheck: boolean;
    };
  };
}

export enum RecruitmentStage {
  APPLIED = 'Applied',
  SHORTLISTED = 'Shortlisted',
  INTERVIEWED = 'Interviewed',
  REJECTED = 'Rejected',
  OFFER_EXTENDED = 'Offer Extended',
  OFFER_REJECTED = 'Offer Rejected',
  HIRED = 'Hired'
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Assessment {
  score: number;
  feedback: string;
  completed: boolean;
  competencies?: Skill[]; // Add optional competencies field to assessment
} 