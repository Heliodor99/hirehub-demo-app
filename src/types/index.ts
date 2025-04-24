import { CommunicationEvent } from '@/components/CommunicationTimeline';

export const RecruitmentStage = {
    OUTREACHED: "Outreached",
    APPLIED: "Applied",
    SHORTLISTED: "Shortlisted",
    INTERVIEWED: "Interviewed",
    REJECTED: "Rejected",
    OFFER_EXTENDED: "Offer Extended",
    OFFER_REJECTED: "Offer Rejected",
    HIRED: "Hired"
};

export interface Education {
    degree: string;
    institution: string;
    year: number;
}

export interface Assessment {
    score: number;
    feedback: string;
    completed: boolean;
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
    skills: string[];
    education: Education[];
    resume: string;
    source: string;
    appliedDate: string;
    stage: string;
    jobId: string;
    notes?: string;
    assessment?: Assessment;
    interview?: Interview;
    communicationTimeline?: CommunicationEvent[];
    lastUpdated?: string;
}

export interface Job {
    id: string;
    title: string;
    company: string;
    department: string;
    location: string;
    type?: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    salary: {
        min: number;
        max: number;
        currency: string;
    };
    postedDate: string;
    closingDate?: string;
    status: string;
    hiringManager: string;
    recruiter: string;
    pipeline: {
        stages: string[];
    };
    skills: string[];
    benefits: string[];
}

export interface InterviewQuestion {
    timestamp?: string;
    question?: string;
    answer?: string;
    time?: string;
    speaker?: "Interviewer" | "Candidate";
    content?: string;
}

export interface Interview {
    id: string | number;
    candidateId: string;
    jobId: string;
    candidate?: {
        name: string;
        position: string;
    };
    date: string;
    time: string;
    interviewers: string[];
    type: string;
    status: string;
    location: string;
    notes?: string;
    transcript: InterviewQuestion[];
    aiAssessment?: {
        overallScore: number;
        categoryScores?: {
            technical: number;
            communication: number;
            problemSolving: number;
            culturalFit: number;
        };
        technical?: number;
        cultural?: number;
        communication?: number;
        overall?: number;
        strengths: string[];
        weaknesses?: string[];
        areasForImprovement?: string[];
        recommendation?: string;
        recommendations?: string[];
    };
    humanFeedback?: {
        score: number;
        notes: string;
        nextSteps: string;
        decision: string;
    };
}
