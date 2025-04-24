import { Candidate, Job, RecruitmentStage, CommunicationEvent } from '@/types';

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const addDays = (date: Date, days: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

export const generateCommunicationTimeline = (candidate: Candidate, job: Job): CommunicationEvent[] => {
  const timeline: CommunicationEvent[] = [];
  const startDate = new Date(candidate.appliedDate);
  let currentDate = new Date(startDate);

  // Initial application
  timeline.push({
    id: `${candidate.id}-1`,
    date: formatDate(currentDate),
    time: '09:30',
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
    time: '09:35',
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
    time: '11:00',
    type: 'email',
    channel: 'Email',
    subject: `Following up on your ${job.title} application`,
    content: `Hi ${candidate.name},\n\nI hope this email finds you well. I'm ${job.recruiter}, the recruiter for the ${job.title} position. I've reviewed your application and would like to discuss your experience and the role in more detail.\n\nWould you be available for a brief call this week?\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });

  // Candidate response
  timeline.push({
    id: `${candidate.id}-4`,
    date: formatDate(currentDate),
    time: '14:30',
    type: 'email',
    channel: 'Email',
    subject: `Re: Following up on your ${job.title} application`,
    content: `Dear ${job.recruiter},\n\nThank you for reaching out. I'm very interested in the position and would be happy to discuss it further.\n\nI'm available for a call tomorrow between 10 AM and 4 PM.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter
  });

  if (candidate.stage === RecruitmentStage.APPLIED) {
    return timeline;
  }

  // Phone screening
  currentDate = addDays(currentDate, 1);
  timeline.push({
    id: `${candidate.id}-5`,
    date: formatDate(currentDate),
    time: '10:00',
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

  // Assessment invitation
  timeline.push({
    id: `${candidate.id}-6`,
    date: formatDate(currentDate),
    time: '11:00',
    type: 'email',
    channel: 'Email',
    subject: 'Technical Assessment Invitation',
    content: `Dear ${candidate.name},\n\nThank you for your time on the call today. We would like to proceed with a technical assessment.\n\nPlease complete the assessment within 48 hours using the link below.\n\n[Assessment Link]\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    attachments: [{
      name: 'Assessment Instructions.pdf',
      type: 'application/pdf',
      size: '245 KB'
    }]
  });

  if (candidate.stage === RecruitmentStage.SHORTLISTED) {
    // Assessment completion
    currentDate = addDays(currentDate, 1);
    timeline.push({
      id: `${candidate.id}-7`,
      date: formatDate(currentDate),
      time: '15:00',
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

  // Technical Interview Scheduling
  currentDate = addDays(currentDate, 2);
  const interviewDate = addDays(currentDate, 3);
  
  timeline.push({
    id: `${candidate.id}-8`,
    date: formatDate(currentDate),
    time: '10:00',
    type: 'email',
    channel: 'Email',
    subject: 'Technical Interview Scheduling',
    content: `Dear ${candidate.name},\n\nWe would like to schedule a technical interview with our team.\n\nProposed date: ${formatDate(interviewDate)} at 10:00 AM\n\nPlease confirm if this works for you.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });

  // Candidate confirmation
  timeline.push({
    id: `${candidate.id}-9`,
    date: formatDate(currentDate),
    time: '11:30',
    type: 'email',
    channel: 'Email',
    subject: 'Re: Technical Interview Scheduling',
    content: `Dear ${job.recruiter},\n\nThank you for the invitation. I confirm my availability for the technical interview on ${formatDate(interviewDate)} at 10:00 AM.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter
  });

  // Calendar invite
  timeline.push({
    id: `${candidate.id}-10`,
    date: formatDate(currentDate),
    time: '13:00',
    type: 'calendar',
    channel: 'Google Calendar',
    subject: `Technical Interview - ${candidate.name} for ${job.title}`,
    content: `Technical interview with ${job.hiringManager} (Hiring Manager)\nLocation: Google Meet\nDuration: 1 hour`,
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

  if (candidate.stage === RecruitmentStage.INTERVIEWED) {
    // Interview completed
    currentDate = new Date(interviewDate);
    timeline.push({
      id: `${candidate.id}-11`,
      date: formatDate(currentDate),
      time: '10:00',
      type: 'interview',
      channel: 'Google Meet',
      subject: 'Technical Interview Completed',
      content: 'Technical interview conducted with detailed evaluation and feedback recorded.',
      direction: 'system',
      status: 'completed',
      metadata: {
        duration: '65 minutes',
        interviewer: job.hiringManager,
        overallScore: candidate.interview?.aiAssessment.overallScore
      }
    });

    return timeline;
  }

  // Offer Process
  if ([RecruitmentStage.OFFER_EXTENDED, RecruitmentStage.HIRED, RecruitmentStage.OFFER_REJECTED].includes(candidate.stage)) {
    currentDate = addDays(interviewDate, 2);
    
    // Internal approval email
    timeline.push({
      id: `${candidate.id}-12`,
      date: formatDate(currentDate),
      time: '09:00',
      type: 'email',
      channel: 'Email',
      subject: `Offer Approval - ${candidate.name} for ${job.title}`,
      content: `The hiring team has approved extending an offer to ${candidate.name} for the ${job.title} position.\n\nBase Salary: ${job.salary.currency} ${job.salary.max}\nStart Date: TBD`,
      direction: 'system',
      status: 'completed',
      sender: job.hiringManager,
      recipient: job.recruiter
    });

    // Offer letter
    timeline.push({
      id: `${candidate.id}-13`,
      date: formatDate(currentDate),
      time: '14:00',
      type: 'email',
      channel: 'Email',
      subject: `Offer Letter - ${job.title} at ${job.company}`,
      content: `Dear ${candidate.name},\n\nWe are pleased to offer you the position of ${job.title} at ${job.company}.\n\nPlease find the detailed offer letter attached.\n\nBest regards,\n${job.recruiter}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.email,
      attachments: [{
        name: 'Offer_Letter.pdf',
        type: 'application/pdf',
        size: '425 KB'
      }]
    });

    if (candidate.stage === RecruitmentStage.OFFER_REJECTED) {
      // Offer rejection
      currentDate = addDays(currentDate, 2);
      timeline.push({
        id: `${candidate.id}-14`,
        date: formatDate(currentDate),
        time: '11:00',
        type: 'email',
        channel: 'Email',
        subject: `Re: Offer Letter - ${job.title} at ${job.company}`,
        content: `Dear ${job.recruiter},\n\nThank you for the offer. After careful consideration, I have decided to pursue another opportunity that better aligns with my career goals.\n\nI appreciate your time and consideration.\n\nBest regards,\n${candidate.name}`,
        direction: 'inbound',
        status: 'read',
        sender: candidate.email,
        recipient: job.recruiter
      });
    }

    if (candidate.stage === RecruitmentStage.HIRED) {
      // Offer acceptance
      currentDate = addDays(currentDate, 1);
      timeline.push({
        id: `${candidate.id}-14`,
        date: formatDate(currentDate),
        time: '11:00',
        type: 'email',
        channel: 'Email',
        subject: `Re: Offer Letter - ${job.title} at ${job.company}`,
        content: `Dear ${job.recruiter},\n\nI am pleased to accept the offer for the position of ${job.title} at ${job.company}.\n\nI look forward to joining the team.\n\nBest regards,\n${candidate.name}`,
        direction: 'inbound',
        status: 'read',
        sender: candidate.email,
        recipient: job.recruiter,
        attachments: [{
          name: 'Signed_Offer_Letter.pdf',
          type: 'application/pdf',
          size: '430 KB'
        }]
      });

      // Welcome email
      currentDate = addDays(currentDate, 1);
      timeline.push({
        id: `${candidate.id}-15`,
        date: formatDate(currentDate),
        time: '10:00',
        type: 'email',
        channel: 'Email',
        subject: `Welcome to ${job.company}!`,
        content: `Dear ${candidate.name},\n\nWelcome to the team! We're excited to have you join us.\n\nPlease find attached the onboarding documentation and next steps.\n\nBest regards,\n${job.recruiter}`,
        direction: 'outbound',
        status: 'sent',
        sender: job.recruiter,
        recipient: candidate.email,
        attachments: [{
          name: 'Onboarding_Package.pdf',
          type: 'application/pdf',
          size: '1.2 MB'
        }]
      });
    }
  }

  return timeline;
}; 