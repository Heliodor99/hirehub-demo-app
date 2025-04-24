const fs = require('fs');
const path = require('path');
import type { CommunicationEvent, Candidate, Job } from '../src/types/index.js';

enum RecruitmentStage {
  OUTREACHED = 'Outreached',
  APPLIED = 'Applied',
  SHORTLISTED = 'Shortlisted',
  INTERVIEWED = 'Interviewed',
  REJECTED = 'Rejected',
  OFFER_EXTENDED = 'Offer Extended',
  OFFER_REJECTED = 'Offer Rejected',
  HIRED = 'Hired'
}

// Helper function to generate a random time between 9 AM and 6 PM
const getRandomTime = () => {
  const hours = Math.floor(Math.random() * (18 - 9) + 9);
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Helper function to add days to a date
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Helper function to format date to ISO string without time
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const generateCommunicationTimeline = (candidate: typeof Candidate, job: typeof Job): typeof CommunicationEvent[] => {
  const timeline: typeof CommunicationEvent[] = [];
  const startDate = new Date(candidate.appliedDate);
  let currentDate = new Date(startDate);

  // Initial application
  timeline.push({
    id: `${candidate.id}-1`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'linkedin',
    channel: 'LinkedIn',
    subject: 'Application Submitted',
    content: `Applied for ${job.title} position via LinkedIn`,
    direction: 'inbound',
    status: 'completed',
    metadata: {
      source: 'LinkedIn',
      jobId: job.id
    }
  });

  // Automated application confirmation
  timeline.push({
    id: `${candidate.id}-2`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Application Received - ${job.title}`,
    content: `Dear ${candidate.name},\n\nThank you for applying for the ${job.title} position at ${job.company}. We have received your application and our team will review it shortly.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });

  // Initial recruiter contact
  currentDate = addDays(currentDate, 1);
  timeline.push({
    id: `${candidate.id}-3`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Following up on your ${job.title} application`,
    content: `Hi ${candidate.name},\n\nI hope this email finds you well. I'm ${job.recruiter}, the recruiter for the ${job.title} position. I've reviewed your application and would like to discuss your experience and the role in more detail.\n\nWould you be available for a brief call this week?\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });

  if (candidate.stage === RecruitmentStage.APPLIED) {
    return timeline;
  }

  // Phone screening
  currentDate = addDays(currentDate, 1);
  timeline.push({
    id: `${candidate.id}-4`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'phone',
    channel: 'Phone',
    subject: 'Initial Phone Screening',
    content: 'Conducted initial phone screening. Candidate demonstrated strong interest in the role and relevant experience.',
    direction: 'system',
    status: 'completed',
    metadata: {
      duration: '30 minutes',
      outcome: 'Positive'
    }
  });

  if (candidate.stage === RecruitmentStage.SHORTLISTED) {
    // Technical assessment invitation
    timeline.push({
      id: `${candidate.id}-5`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: 'Technical Assessment Invitation',
      content: `Dear ${candidate.name},\n\nThank you for your time on the call today. We would like to proceed with a technical assessment.\n\nPlease complete the assessment within 48 hours using the link below.\n\n[Assessment Link]\n\nBest regards,\n${job.recruiter}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.email
    });

    // Assessment completion
    currentDate = addDays(currentDate, 2);
    timeline.push({
      id: `${candidate.id}-6`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'assessment',
      channel: 'Platform',
      subject: 'Technical Assessment Completed',
      content: `Candidate completed technical assessment with a score of ${candidate.assessment?.score}%`,
      direction: 'system',
      status: 'completed',
      metadata: {
        score: candidate.assessment?.score,
        duration: '95 minutes',
        completedSections: ['Technical Skills', 'Problem Solving', 'Code Quality']
      }
    });

    return timeline;
  }

  if ([RecruitmentStage.INTERVIEWED, RecruitmentStage.OFFER_EXTENDED, RecruitmentStage.HIRED, RecruitmentStage.OFFER_REJECTED].includes(candidate.stage)) {
    // Interview scheduling
    currentDate = addDays(currentDate, 2);
    const interviewDate = addDays(currentDate, 3);
    
    timeline.push({
      id: `${candidate.id}-7`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'calendar',
      channel: 'Google Calendar',
      subject: `Technical Interview - ${candidate.name}`,
      content: `Technical interview scheduled with ${job.hiringManager}`,
      direction: 'outbound',
      status: 'scheduled',
      sender: job.recruiter,
      recipient: candidate.email,
      metadata: {
        meetLink: 'https://meet.google.com/xxx-yyyy-zzz',
        duration: '1 hour',
        attendees: [candidate.email, job.hiringManager, job.recruiter]
      }
    });

    // Interview feedback
    currentDate = addDays(currentDate, 3);
    timeline.push({
      id: `${candidate.id}-8`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'assessment',
      channel: 'ATS',
      subject: 'Interview Feedback',
      content: 'Technical interview completed. Candidate demonstrated strong technical skills and cultural fit.',
      direction: 'system',
      status: 'completed',
      metadata: {
        interviewer: job.hiringManager,
        duration: '60 minutes',
        overallRating: 4.5
      }
    });
  }

  if ([RecruitmentStage.OFFER_EXTENDED, RecruitmentStage.HIRED, RecruitmentStage.OFFER_REJECTED].includes(candidate.stage)) {
    // Offer letter
    currentDate = addDays(currentDate, 2);
    timeline.push({
      id: `${candidate.id}-9`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Offer Letter - ${job.title} at ${job.company}`,
      content: `Dear ${candidate.name},\n\nWe are pleased to offer you the position of ${job.title} at ${job.company}.\n\nPlease find the attached offer letter with complete details.\n\nBest regards,\n${job.hiringManager}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.hiringManager,
      recipient: candidate.email,
      attachments: [{
        name: 'Offer_Letter.pdf',
        type: 'application/pdf',
        size: '156 KB'
      }]
    });

    if (candidate.stage === RecruitmentStage.HIRED) {
      // Offer acceptance
      currentDate = addDays(currentDate, 2);
      timeline.push({
        id: `${candidate.id}-10`,
        date: formatDate(currentDate),
        time: getRandomTime(),
        type: 'email',
        channel: 'Email',
        subject: `Re: Offer Letter - ${job.title} at ${job.company}`,
        content: 'I am pleased to accept the offer. Thank you for this opportunity.',
        direction: 'inbound',
        status: 'read',
        sender: candidate.email,
        recipient: job.hiringManager,
        attachments: [{
          name: 'Signed_Offer_Letter.pdf',
          type: 'application/pdf',
          size: '180 KB'
        }]
      });
    } else if (candidate.stage === RecruitmentStage.OFFER_REJECTED) {
      // Offer rejection
      currentDate = addDays(currentDate, 2);
      timeline.push({
        id: `${candidate.id}-10`,
        date: formatDate(currentDate),
        time: getRandomTime(),
        type: 'email',
        channel: 'Email',
        subject: `Re: Offer Letter - ${job.title} at ${job.company}`,
        content: 'Thank you for the offer. However, I have decided to pursue another opportunity that better aligns with my career goals.',
        direction: 'inbound',
        status: 'read',
        sender: candidate.email,
        recipient: job.hiringManager
      });
    }
  }

  return timeline;
};

const updateCandidatesWithCommunication = () => {
  try {
    // Read the jobs.ts file
    const filePath = path.join(process.cwd(), 'src', 'data', 'jobs.ts');
    let content = fs.readFileSync(filePath, 'utf8');

    // Import the jobs array directly
    const { jobs } = require('../src/data/jobs');
    
    // Create candidates array if it doesn't exist
    const candidatesMatch = content.match(/export\s+const\s+candidates:\s*Candidate\[\]\s*=\s*\[([\s\S]*?)\];/);
    let candidates: typeof Candidate[];
    
    if (!candidatesMatch) {
      // If candidates array doesn't exist, create it with sample data
      candidates = jobs.flatMap((job: typeof Job) => {
        const numCandidates = Math.floor(Math.random() * 10) + 5; // 5-15 candidates per job
        return Array.from({ length: numCandidates }, (_, i) => ({
          id: `${job.id}-${i + 1}`,
          name: `Candidate ${i + 1} for ${job.title}`,
          email: `candidate${i + 1}@example.com`,
          phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          currentTitle: 'Software Engineer',
          currentCompany: 'Tech Company',
          location: job.location,
          experience: Math.floor(Math.random() * 10) + 2,
          skills: job.skills?.slice(0, 3) || ['JavaScript', 'TypeScript', 'React'],
          education: [{
            degree: 'B.Tech in Computer Science',
            institution: 'Top University',
            year: 2020
          }],
          resume: 'path/to/resume.pdf',
          source: 'LinkedIn',
          appliedDate: new Date(job.postedDate).toISOString().split('T')[0],
          stage: RecruitmentStage.SHORTLISTED,
          jobId: job.id,
          assessment: {
            score: Math.floor(Math.random() * 30) + 70,
            feedback: 'Good technical skills',
            completed: true
          }
        }));
      });

      // Add candidates array to the file
      content = content.replace(
        /export const jobs: Job\[\] = \[([\s\S]*?)\];/,
        `export const jobs: Job[] = [$1];\n\nexport const candidates: Candidate[] = ${JSON.stringify(candidates, null, 2)};`
      );
    } else {
      // Parse existing candidates array
      const candidatesContent = candidatesMatch[1];
      candidates = JSON.parse(`[${candidatesContent}]`);
    }

    // Generate communication timeline for each candidate
    candidates = candidates.map(candidate => {
      const job = jobs.find((j: typeof Job) => j.id === candidate.jobId);
      if (!job) return candidate;

      return {
        ...candidate,
        communicationTimeline: generateCommunicationTimeline(candidate, job)
      };
    });

    // Update the candidates array in the file
    const updatedContent = content.replace(
      /export\s+const\s+candidates:\s*Candidate\[\]\s*=\s*\[([\s\S]*?)\];/,
      `export const candidates: Candidate[] = ${JSON.stringify(candidates, null, 2)};`
    );

    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated ${candidates.length} candidates with communication history`);
  } catch (error) {
    console.error('Error processing candidates:', error);
  }
};

// Run the update
updateCandidatesWithCommunication(); 