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
  user?: User;
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
  current_title: string;
  current_company: string;
  location: string;
  experience: number;
  skills: Skill[] | string[];
  education: Education[];
  resume: string;
  source: string;
  applied_date: string;
  stage: RecruitmentStage;
  job_id: string;
  notes?: string;
  assessment?: Assessment;
  skillCompetencies?: Skill[];
  interview?: Interview;
  last_updated?: string;
  communicationTimeline?: CommunicationEvent[];
  // Deprecated camelCase fields for backward compatibility
  /** @deprecated Use current_title */
  currentTitle?: string;
  /** @deprecated Use current_company */
  currentCompany?: string;
  /** @deprecated Use applied_date */
  appliedDate?: string;
  /** @deprecated Use job_id */
  jobId?: string;
  /** @deprecated Use last_updated */
  lastUpdated?: string;
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
  OUTREACHED = 'Outreached',
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