import { Candidate, Job, RecruitmentStage } from '@/types';
import { CommunicationEvent } from '@/components/CommunicationTimeline';
import { v4 as uuidv4 } from 'uuid';

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const formatTime = (date: Date): string => {
  return date.toTimeString().split(' ')[0].substring(0, 5);
};

const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const addHours = (date: Date, hours: number): Date => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

// Helper function to get a random time between 9am and 6pm
const getRandomTime = (): string => {
  const hours = Math.floor(Math.random() * (18 - 9) + 9);
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const generateCommunicationTimeline = (candidate: Candidate, job: Job): CommunicationEvent[] => {
  const timeline: CommunicationEvent[] = [];
  
  // Calculate baseline dates
  let outreachDate = new Date();
  if (candidate.appliedDate) {
    // If we have an application date, set outreach to 5 days before
    outreachDate = new Date(candidate.appliedDate);
    outreachDate.setDate(outreachDate.getDate() - 5);
  } else {
    // Default to 20 days ago
    outreachDate.setDate(outreachDate.getDate() - 20);
  }
  
  const applicationDate = candidate.appliedDate ? new Date(candidate.appliedDate) : addDays(outreachDate, 3);
  const shortlistDate = addDays(applicationDate, 2);
  const interviewInviteDate = addDays(shortlistDate, 1);
  const interviewScheduleDate = addDays(interviewInviteDate, 1);
  const interviewDate = addDays(interviewScheduleDate, 3);
  const interviewFollowupDate = addDays(interviewDate, 1);
  const offerDate = addDays(interviewFollowupDate, 3);
  const responseDate = addDays(offerDate, 2);
  
  // 1. OUTREACH STAGE 
  // Only candidates who were sourced by a recruiter have outreach communications
  if (candidate.source === 'Recruiter') {
    addOutreachCommunications(timeline, candidate, job, outreachDate);
  }
  
  // 2. APPLICATION STAGE - only if the candidate has actually applied (not just outreached)
  if (candidate.stage !== RecruitmentStage.OUTREACHED) {
    addApplicationCommunications(timeline, candidate, job, applicationDate);
  }
  
  // 3. SHORTLISTING STAGE
  if ([RecruitmentStage.SHORTLISTED, RecruitmentStage.INTERVIEWED, RecruitmentStage.REJECTED, 
       RecruitmentStage.OFFER_EXTENDED, RecruitmentStage.OFFER_REJECTED, RecruitmentStage.HIRED].includes(candidate.stage)) {
    addShortlistCommunications(timeline, candidate, job, shortlistDate);
  }
  
  // 4. INTERVIEW STAGE
  if ([RecruitmentStage.INTERVIEWED, RecruitmentStage.REJECTED, RecruitmentStage.OFFER_EXTENDED,
       RecruitmentStage.OFFER_REJECTED, RecruitmentStage.HIRED].includes(candidate.stage)) {
    // Interview invitation/scheduling
    addInterviewInviteCommunications(timeline, candidate, job, interviewInviteDate);
    
    // The actual interview
    addInterviewCommunications(timeline, candidate, job, interviewDate);
    
    // Post-interview follow-up
    addInterviewFollowupCommunications(timeline, candidate, job, interviewFollowupDate);
  }
  
  // 5. OFFER STAGE
  if ([RecruitmentStage.OFFER_EXTENDED, RecruitmentStage.OFFER_REJECTED, RecruitmentStage.HIRED].includes(candidate.stage)) {
    addOfferCommunications(timeline, candidate, job, offerDate);
  }
  
  // 6. OFFER RESPONSE STAGE
  if ([RecruitmentStage.OFFER_REJECTED, RecruitmentStage.HIRED].includes(candidate.stage)) {
    if (candidate.stage === RecruitmentStage.HIRED) {
      addHiredCommunications(timeline, candidate, job, responseDate);
    } else {
      addRejectedOfferCommunications(timeline, candidate, job, responseDate);
    }
  }
  
  // 7. REJECTED STAGE (rejection can happen at any stage after application)
  if (candidate.stage === RecruitmentStage.REJECTED) {
    // Add rejection based on where the candidate got to in the process
    if (candidate.interview) {
      // Rejection after interview
      addPostInterviewRejectionCommunications(timeline, candidate, job, interviewFollowupDate);
    } else if (candidate.assessment) {
      // Rejection after assessment
      addPostAssessmentRejectionCommunications(timeline, candidate, job, shortlistDate);
    } else {
      // Rejection after application review
      addEarlyRejectionCommunications(timeline, candidate, job, shortlistDate);
    }
  }
  
  // Sort all entries by date and time
  return timeline.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
};

// Helper functions to add communications for each stage

function addOutreachCommunications(timeline: CommunicationEvent[], candidate: Candidate, job: Job, outreachDate: Date): void {
  // Initial outreach - randomly choose between email and WhatsApp
  const useWhatsApp = Math.random() > 0.5;
  const outreachId = uuidv4();
  
  if (useWhatsApp) {
    timeline.push({
      id: outreachId,
      date: formatDate(outreachDate),
      time: '09:00',
      type: 'message',
      channel: 'WhatsApp',
      subject: 'Initial Outreach',
      content: `Hi ${candidate.name}, this is ${job.recruiter} from ${job.company}. We're currently looking for a ${job.title} and your profile caught our attention. Based on your experience at ${candidate.currentCompany}, we think you'd be a great fit. Would you be interested in exploring this opportunity?`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.name,
      metadata: {
        tags: ['Outreach', 'WhatsApp']
      }
    });
    
    // Candidate's response on WhatsApp (positive)
    const responseDate = addHours(outreachDate, 3);
    const responseTime = formatTime(responseDate);
    
    timeline.push({
      id: uuidv4(),
      date: formatDate(responseDate),
      time: responseTime,
      type: 'message',
      channel: 'WhatsApp',
      subject: 'Response to Outreach',
      content: `Hi ${job.recruiter}, thanks for reaching out! Yes, I'd be interested in learning more about the ${job.title} position at ${job.company}. Could you share some details about the role?`,
      direction: 'inbound',
      status: 'read',
      sender: candidate.name,
      recipient: job.recruiter,
      relatedEvents: [outreachId],
      metadata: {
        tags: ['Interested', 'WhatsApp']
      }
    });
    
    // Recruiter's follow-up with more details
    const followUpDate = addHours(responseDate, 1);
    const followUpTime = formatTime(followUpDate);
    
    timeline.push({
      id: uuidv4(),
      date: formatDate(followUpDate),
      time: followUpTime,
      type: 'message',
      channel: 'WhatsApp',
      subject: 'Role Details',
      content: `Great to hear from you! The role involves ${job.responsibilities[0].toLowerCase()} and ${job.responsibilities.length > 1 ? job.responsibilities[1].toLowerCase() : 'other exciting responsibilities'}. We're looking for someone with skills in ${job.skills.slice(0, 3).join(', ')}. The salary range is ${job.salary.currency}${job.salary.min}-${job.salary.max}. If you're interested, I'd love to invite you to apply formally through our careers page. I can send you the link.`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.name,
      metadata: {
        tags: ['Role Details', 'WhatsApp']
      }
    });
  } else {
    // Email outreach
    timeline.push({
      id: outreachId,
      date: formatDate(outreachDate),
      time: '09:00',
      type: 'email',
      channel: 'Email',
      subject: `Opportunity: ${job.title} at ${job.company}`,
      content: `Dear ${candidate.name},\n\nI hope this email finds you well. I'm ${job.recruiter}, a recruiter at ${job.company}, and I came across your profile which caught my attention.\n\nWe're currently looking for a ${job.title} to join our team, and based on your experience at ${candidate.currentCompany}, I believe you could be a great fit for this role.\n\nThe position involves:\n- ${job.responsibilities[0]}\n- ${job.responsibilities.length > 1 ? job.responsibilities[1] : 'Other exciting responsibilities'}\n\nWould you be interested in learning more about this opportunity? If so, I'd be happy to provide additional details or schedule a brief call to discuss.\n\nBest regards,\n${job.recruiter}\n${job.company}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.email,
      metadata: {
        tags: ['Outreach', 'Initial Contact']
      }
    });
    
    // Candidate's response to email outreach
    const responseDate = addHours(outreachDate, 5);
    const responseTime = formatTime(responseDate);
    
    timeline.push({
      id: uuidv4(),
      date: formatDate(responseDate),
      time: responseTime,
      type: 'email',
      channel: 'Email',
      subject: `Re: Opportunity: ${job.title} at ${job.company}`,
      content: `Dear ${job.recruiter},\n\nThank you for reaching out regarding the ${job.title} position at ${job.company}. I'm definitely interested in learning more about this opportunity.\n\nCould you please provide additional details about the role, including the expected salary range and the skills you're looking for?\n\nI look forward to hearing from you.\n\nBest regards,\n${candidate.name}`,
      direction: 'inbound',
      status: 'read',
      sender: candidate.email,
      recipient: job.recruiter,
      relatedEvents: [outreachId],
      metadata: {
        tags: ['Interested', 'Email']
      }
    });
    
    // Recruiter's follow-up with more details
    const followUpDate = addHours(responseDate, 3);
    const followUpId = uuidv4();
    const followUpTime = formatTime(followUpDate);
    
    timeline.push({
      id: followUpId,
      date: formatDate(followUpDate),
      time: followUpTime,
      type: 'email',
      channel: 'Email',
      subject: `Re: Opportunity: ${job.title} at ${job.company}`,
      content: `Dear ${candidate.name},\n\nThank you for your interest in the ${job.title} position. I'm happy to provide more details.\n\nSalary Range: ${job.salary.currency}${job.salary.min}-${job.salary.max} annually\n\nKey Skills Required:\n- ${job.skills.slice(0, 3).join('\n- ')}\n\nThe position will involve working with our ${job.department} team on projects related to ${job.description.substring(0, 100)}...\n\nIf you're interested in pursuing this opportunity, please apply through our careers page at [Career Page Link]. After your application, we'll move forward with the screening process.\n\nFeel free to reach out if you have any other questions.\n\nBest regards,\n${job.recruiter}\n${job.company}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.email,
      metadata: {
        tags: ['Role Details', 'Email']
      }
    });
  }
}

function addApplicationCommunications(timeline: CommunicationEvent[], candidate: Candidate, job: Job, applicationDate: Date): void {
  // Application received
  const applicationId = uuidv4();
  timeline.push({
    id: applicationId,
    date: formatDate(applicationDate),
    time: '09:30',
    type: 'system',
    channel: 'Applicant Tracking System',
    subject: 'Application Received',
    content: `${candidate.name} applied for the ${job.title} position.`,
    direction: 'system',
    status: 'completed',
    metadata: {
      statusUpdate: 'Application Received',
      tags: ['New Application']
    }
  });

  // Application source message
  timeline.push({
    id: uuidv4(),
    date: formatDate(applicationDate),
    time: '09:30',
    type: 'system',
    channel: candidate.source,
    subject: 'Application Submitted',
    content: `Applied for ${job.title} position via ${candidate.source}`,
    direction: 'inbound',
    status: 'completed',
    sender: candidate.email,
    recipient: job.recruiter,
    metadata: {
      tags: [candidate.source]
    },
    relatedEvents: [applicationId]
  });

  // Automated application confirmation
  const confirmationId = uuidv4();
  timeline.push({
    id: confirmationId,
    date: formatDate(applicationDate),
    time: '09:35',
    type: 'email',
    channel: 'Email',
    subject: `Application Received - ${job.title}`,
    content: `Dear ${candidate.name},\n\nThank you for applying for the ${job.title} position at ${job.company}. We have received your application and our team will review it shortly.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    relatedEvents: [applicationId]
  });

  if (candidate.resume) {
    // Resume received
    timeline.push({
      id: uuidv4(),
      date: formatDate(applicationDate),
      time: '09:30',
      type: 'system',
      channel: 'Document Management',
      subject: 'Resume Received',
      content: `Resume received from ${candidate.name}`,
      direction: 'system',
      status: 'completed',
      attachments: [{
        name: `${candidate.name.replace(/ /g, '_')}_Resume.pdf`,
        size: '2.4 MB',
        type: 'application/pdf'
      }],
      relatedEvents: [applicationId, confirmationId]
    });
  }

  // Candidate follow-up via WhatsApp (50% chance)
  if (Math.random() > 0.5) {
    const followUpDate = addDays(applicationDate, 2);
    const followUpId = uuidv4();
    timeline.push({
      id: followUpId,
      date: formatDate(followUpDate),
      time: '14:25',
      type: 'message',
      channel: 'WhatsApp',
      subject: 'Application Follow-up',
      content: `Hi ${job.recruiter}, I just wanted to follow up on my application for the ${job.title} position. I'm really excited about the opportunity to work with ${job.company} and wanted to know if there's any additional information I can provide to support my application.`,
      direction: 'inbound',
      status: 'read',
      sender: candidate.name,
      recipient: job.recruiter,
      relatedEvents: [applicationId],
      metadata: {
        tags: ['Follow-up', 'WhatsApp']
      }
    });

    // Recruiter response on WhatsApp
    const responseDate = addHours(followUpDate, 1);
    timeline.push({
      id: uuidv4(),
      date: formatDate(responseDate),
      time: formatTime(responseDate),
      type: 'message',
      channel: 'WhatsApp',
      subject: 'Application Status',
      content: `Hi ${candidate.name}, thanks for your follow-up! We're currently reviewing applications for the ${job.title} position. We expect to complete the initial review within the next few days, after which we'll be in touch regarding next steps. Appreciate your interest in ${job.company}!`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.name,
      relatedEvents: [followUpId],
      metadata: {
        tags: ['Application Status', 'WhatsApp']
      }
    });
  }
}

function addShortlistCommunications(timeline: CommunicationEvent[], candidate: Candidate, job: Job, shortlistDate: Date): void {
  // Internal note about shortlisting
  const shortlistNoteId = uuidv4();
  timeline.push({
    id: shortlistNoteId,
    date: formatDate(shortlistDate),
    time: '10:00',
    type: 'note',
    channel: 'Internal Note',
    subject: 'Candidate Shortlisted',
    content: `${candidate.name} has been shortlisted for the ${job.title} position. Initial resume review shows strong match for required skills: ${candidate.skills.slice(0, 3).join(', ')}. Recommend proceeding with technical assessment.`,
    direction: 'system',
    status: 'completed',
    sender: job.recruiter,
    metadata: {
      tags: ['Shortlisted', 'Positive Review']
    }
  });

  // Shortlist notification email
  const shortlistEmailId = uuidv4();
  timeline.push({
    id: shortlistEmailId,
    date: formatDate(shortlistDate),
    time: '11:30',
    type: 'email',
    channel: 'Email',
    subject: `Your ${job.title} Application - Next Steps`,
    content: `Dear ${candidate.name},\n\nThank you for your application for the ${job.title} position at ${job.company}.\n\nWe're pleased to inform you that after reviewing your application, we would like to move forward with the next step in our selection process. We'd like to invite you to complete a technical assessment to help us better understand your skills and experience.\n\nYou'll receive a separate email with instructions to access the assessment. Please complete it within 48 hours of receiving the instructions.\n\nIf you have any questions, please don't hesitate to contact me.\n\nBest regards,\n${job.recruiter}\n${job.company}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    relatedEvents: [shortlistNoteId],
    metadata: {
      tags: ['Shortlisted', 'Assessment Invitation']
    }
  });

  // Assessment invitation
  const assessmentDate = addHours(shortlistDate, 1);
  const assessmentId = uuidv4();
  timeline.push({
    id: assessmentId,
    date: formatDate(assessmentDate),
    time: formatTime(assessmentDate),
    type: 'email',
    channel: 'Email',
    subject: `Technical Assessment for ${job.title} Position`,
    content: `Dear ${candidate.name},\n\nAs mentioned in my previous email, we'd like you to complete a technical assessment as part of your application for the ${job.title} position.\n\nPlease use the link below to access the assessment:\n[Assessment Platform Link]\n\nAccess Code: TECH-${candidate.id.substring(0, 4)}\n\nThe assessment should take approximately 60-90 minutes to complete. Please ensure you have a stable internet connection and a quiet environment before starting.\n\nIf you encounter any technical issues, please contact our support team at support@${job.company.toLowerCase().replace(/ /g, '')}.com.\n\nBest regards,\n${job.recruiter}\n${job.company}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    relatedEvents: [shortlistEmailId],
    attachments: [{
      name: 'Assessment_Instructions.pdf',
      type: 'application/pdf',
      size: '245 KB'
    }],
    metadata: {
      tags: ['Assessment', 'Technical Evaluation']
    }
  });

  // Candidate acknowledges via WhatsApp
  const acknowledgeDate = addHours(assessmentDate, 2);
  timeline.push({
    id: uuidv4(),
    date: formatDate(acknowledgeDate),
    time: formatTime(acknowledgeDate),
    type: 'message',
    channel: 'WhatsApp',
    subject: 'Assessment Acknowledgment',
    content: `Hi ${job.recruiter}, I've received the technical assessment invitation. I'll complete it today. Thanks for moving forward with my application!`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.name,
    recipient: job.recruiter,
    relatedEvents: [assessmentId],
    metadata: {
      tags: ['Assessment', 'WhatsApp']
    }
  });

  // Assessment completed
  const completionDate = addDays(shortlistDate, 1);
  const completionId = uuidv4();
  const score = candidate.assessment?.score || Math.floor(Math.random() * 30) + 70; // 70-99 score range
  
  timeline.push({
    id: completionId,
    date: formatDate(completionDate),
    time: '15:30',
    type: 'assessment',
    channel: 'Assessment Platform',
    subject: 'Technical Assessment Completed',
    content: `${candidate.name} completed the technical assessment with a score of ${score}%.`,
    direction: 'system',
    status: 'completed',
    metadata: {
      score: score,
      duration: '85 minutes',
      tags: ['Assessment', 'Completed']
    },
    relatedEvents: [assessmentId]
  });

  // Assessment result notification
  const resultDate = addHours(completionDate, 4);
  timeline.push({
    id: uuidv4(),
    date: formatDate(resultDate),
    time: formatTime(resultDate),
    type: 'email',
    channel: 'Email',
    subject: `Assessment Results - ${job.title} Application`,
    content: `Dear ${candidate.name},\n\nThank you for completing the technical assessment for the ${job.title} position.\n\nWe're pleased to inform you that you've successfully passed this stage of our selection process. Your performance demonstrated the technical skills we're looking for in this role.\n\nOur hiring team would like to proceed with an interview to further discuss your qualifications and experience. You'll receive an invitation shortly to schedule this interview.\n\nBest regards,\n${job.recruiter}\n${job.company}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    relatedEvents: [completionId],
    metadata: {
      tags: ['Assessment Results', 'Positive']
    }
  });
}

function addInterviewInviteCommunications(timeline: CommunicationEvent[], candidate: Candidate, job: Job, inviteDate: Date): void {
  // Interview invitation email
  const inviteId = uuidv4();
  timeline.push({
    id: inviteId,
    date: formatDate(inviteDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Interview Invitation: ${job.title} at ${job.company}`,
    content: `Dear ${candidate.name},\n\nWe're pleased to inform you that after reviewing your application for the ${job.title} position, we would like to invite you for an interview.\n\nCould you please let us know your availability for a ${candidate.interview?.type || '45-minute'} interview in the upcoming week?\n\nWe're looking forward to discussing your qualifications and experience in more detail.\n\nBest regards,\n${job.recruiter}\n${job.company}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    metadata: {
      tags: ['Interview', 'Invitation']
    }
  });

  // Candidate response with availability
  const responseDate = addHours(inviteDate, 4);
  const responseId = uuidv4();
  timeline.push({
    id: responseId,
    date: formatDate(responseDate),
    time: formatTime(responseDate),
    type: 'email',
    channel: 'Email',
    subject: `Re: Interview Invitation: ${job.title} at ${job.company}`,
    content: `Dear ${job.recruiter},\n\nThank you for the interview invitation. I'm excited about the opportunity to discuss my qualifications for the ${job.title} position.\n\nI'm available on the following dates next week:\n- Monday: 10:00 AM - 2:00 PM\n- Wednesday: 1:00 PM - 5:00 PM\n- Friday: 9:00 AM - 12:00 PM\n\nPlease let me know which time works best for you and your team.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter,
    relatedEvents: [inviteId],
    metadata: {
      tags: ['Interview', 'Availability']
    }
  });

  // Confirm interview schedule
  const confirmDate = addHours(responseDate, 3);
  timeline.push({
    id: uuidv4(),
    date: formatDate(confirmDate),
    time: formatTime(confirmDate),
    type: 'email',
    channel: 'Email',
    subject: `Interview Confirmation: ${job.title} at ${job.company}`,
    content: `Dear ${candidate.name},\n\nThank you for providing your availability. We'd like to schedule your interview for ${candidate.interview?.date || 'next Wednesday'} at ${candidate.interview?.time || '2:00 PM'}.\n\n${candidate.interview?.type === 'Technical' ? 'This will be a technical interview where you\'ll be asked to solve coding problems and discuss your technical experience.' : 'This will be an interview to discuss your experience and qualifications in more detail.'}\n\n${candidate.interview?.location.includes('Zoom') ? `The interview will be conducted via Zoom. Here's the meeting link: [Zoom Link]` : `The interview will be held at our office: ${job.company} Headquarters`}\n\nPlease confirm that this time works for you.\n\nBest regards,\n${job.recruiter}\n${job.company}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    relatedEvents: [responseId],
    metadata: {
      tags: ['Interview', 'Confirmation'],
      interviewDetails: {
        date: candidate.interview?.date,
        time: candidate.interview?.time,
        type: candidate.interview?.type,
        location: candidate.interview?.location
      }
    }
  });

  // Calendar invitation
  const calendarDate = addHours(confirmDate, 1);
  timeline.push({
    id: uuidv4(),
    date: formatDate(calendarDate),
    time: formatTime(calendarDate),
    type: 'calendar',
    channel: 'Calendar',
    subject: `Interview: ${candidate.name} - ${job.title}`,
    content: `Interview with ${candidate.name} for the ${job.title} position.\n\nLocation: ${candidate.interview?.location || 'Zoom Video Call'}\nType: ${candidate.interview?.type || 'Initial'} Interview\n\nParticipants:\n- ${job.recruiter} (Recruiter)\n- ${job.hiringManager} (Hiring Manager)\n- ${candidate.name} (Candidate)`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    metadata: {
      tags: ['Interview', 'Calendar'],
      interviewDetails: {
        date: candidate.interview?.date,
        time: candidate.interview?.time,
        duration: '45 minutes'
      }
    },
    attachments: [
      {
        name: 'Interview_Invitation.ics',
        type: 'text/calendar',
        size: '2 KB'
      }
    ]
  });
}

function addInterviewCommunications(timeline: CommunicationEvent[], candidate: Candidate, job: Job, interviewDate: Date): void {
  // Pre-interview reminder (day before)
  const reminderDate = addDays(interviewDate, -1);
  const reminderId = uuidv4();
  timeline.push({
    id: reminderId,
    date: formatDate(reminderDate),
    time: '09:00',
    type: 'email',
    channel: 'Email',
    subject: `Reminder: Your ${job.title} Interview Tomorrow`,
    content: `Dear ${candidate.name},\n\nThis is a friendly reminder that your interview for the ${job.title} position is scheduled for tomorrow, ${formatDate(interviewDate)} at ${candidate.interview?.time || '10:00 AM'}.\n\n${candidate.interview?.location.includes('Zoom') ? 
      `The interview will be conducted via Zoom. Here's the meeting link again: [Zoom Link]\n\nPlease ensure your camera and microphone are working properly before the interview.` : 
      `The interview will be held at our office: ${job.company} Headquarters at ${candidate.interview?.location || '123 Main Street'}.\n\nPlease arrive 10 minutes early and check in with reception upon arrival.`}\n\n${candidate.interview?.type === 'Technical' ? 
      `This will be a technical interview focusing on your skills in ${job.skills.slice(0, 3).join(', ')}. You may be asked to solve coding problems or discuss technical concepts.` : 
      `This will be an interview to discuss your experience, qualifications, and fit for the role.`}\n\nIf you need to reschedule or have any questions, please let me know as soon as possible.\n\nBest regards,\n${job.recruiter}\n${job.company}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    metadata: {
      tags: ['Interview', 'Reminder']
    }
  });

  // Candidate confirmation
  const confirmDate = addHours(reminderDate, 2);
  timeline.push({
    id: uuidv4(),
    date: formatDate(confirmDate),
    time: formatTime(confirmDate),
    type: 'email',
    channel: 'Email',
    subject: `Re: Reminder: Your ${job.title} Interview Tomorrow`,
    content: `Dear ${job.recruiter},\n\nThank you for the reminder. I'm looking forward to the interview tomorrow at ${candidate.interview?.time || '10:00 AM'}.\n\nI've prepared for our discussion and am excited to learn more about the opportunity.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter,
    relatedEvents: [reminderId],
    metadata: {
      tags: ['Interview', 'Confirmation']
    }
  });

  // Interview started notification
  timeline.push({
    id: uuidv4(),
    date: formatDate(interviewDate),
    time: candidate.interview?.time || '10:00',
    type: 'system',
    channel: 'Calendar',
    subject: 'Interview Started',
    content: `${candidate.interview?.type || 'Job'} Interview with ${candidate.name} started.`,
    direction: 'system',
    status: 'completed',
    metadata: {
      tags: ['Interview', 'Started'],
      interviewDetails: {
        type: candidate.interview?.type || 'Job',
        interviewer: job.hiringManager,
        duration: '45 minutes'
      }
    }
  });

  // Interview transcript (if available)
  if (candidate.interview?.transcript && candidate.interview.transcript.length > 0) {
    // Create transcript record
    const transcriptId = uuidv4();
    timeline.push({
      id: transcriptId,
      date: formatDate(interviewDate),
      time: candidate.interview?.time ? formatTime(addMinutes(new Date(`${formatDate(interviewDate)}T${candidate.interview.time}`), 45)) : '10:45',
      type: 'document',
      channel: 'Interview System',
      subject: 'Interview Transcript',
      content: `Transcript of ${candidate.interview?.type || 'Job'} Interview with ${candidate.name} for ${job.title} position.`,
      direction: 'system',
      status: 'completed',
      attachments: [{
        name: `${candidate.name.replace(/ /g, '_')}_Interview_Transcript.pdf`,
        size: '345 KB',
        type: 'application/pdf'
      }],
      metadata: {
        tags: ['Interview', 'Transcript'],
        questions: candidate.interview.transcript.length
      }
    });

    // Add a few key interview questions as separate messages (for better visibility)
    const questionsToShow = Math.min(3, candidate.interview.transcript.length);
    for (let i = 0; i < questionsToShow; i++) {
      const questionTime = candidate.interview?.time ? 
        formatTime(addMinutes(new Date(`${formatDate(interviewDate)}T${candidate.interview.time}`), 5 + (i * 10))) : 
        `${10 + Math.floor(i/2)}:${(i % 2) * 30}`;
      
      timeline.push({
        id: uuidv4(),
        date: formatDate(interviewDate),
        time: questionTime,
        type: 'note',
        channel: 'Interview',
        subject: `Interview Question ${i+1}`,
        content: `Q: ${candidate.interview.transcript[i].question || 'Tell me about your experience at ' + candidate.currentCompany}\n\nA: ${candidate.interview.transcript[i].answer || 'Candidate described their experience with emphasis on relevant skills including ' + candidate.skills.slice(0, 2).join(' and ')}`,
        direction: 'system',
        status: 'completed',
        relatedEvents: [transcriptId],
        metadata: {
          tags: ['Interview', 'Question'],
          speaker: {
            question: 'Interviewer',
            answer: 'Candidate'
          }
        }
      });
    }
  } else {
    // If no transcript, add a simple interview summary
    timeline.push({
      id: uuidv4(),
      date: formatDate(interviewDate),
      time: candidate.interview?.time ? formatTime(addMinutes(new Date(`${formatDate(interviewDate)}T${candidate.interview.time}`), 45)) : '10:45',
      type: 'note',
      channel: 'Interview',
      subject: 'Interview Summary',
      content: `Interview completed with ${candidate.name}. Discussed candidate's experience at ${candidate.currentCompany}, their skills in ${candidate.skills.slice(0, 3).join(', ')}, and their interest in the ${job.title} position.\n\nCandidate demonstrated strong knowledge in ${job.skills[0]} and showed enthusiasm for the role.`,
      direction: 'system',
      status: 'completed',
      sender: job.hiringManager,
      metadata: {
        tags: ['Interview', 'Summary'],
        duration: '45 minutes'
      }
    });
  }

  // Interview completed system notification
  timeline.push({
    id: uuidv4(),
    date: formatDate(interviewDate),
    time: candidate.interview?.time ? formatTime(addMinutes(new Date(`${formatDate(interviewDate)}T${candidate.interview.time}`), 50)) : '10:50',
    type: 'system',
    channel: 'Calendar',
    subject: 'Interview Completed',
    content: `${candidate.interview?.type || 'Job'} Interview with ${candidate.name} completed.`,
    direction: 'system',
    status: 'completed',
    metadata: {
      tags: ['Interview', 'Completed'],
      outcome: 'Completed'
    }
  });
}

// Helper function to add minutes to a date
function addMinutes(date: Date, minutes: number): Date {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
}

function addInterviewFollowupCommunications(timeline: CommunicationEvent[], candidate: Candidate, job: Job, followupDate: Date): void {
  // Thank you email after interview
  const followupId = uuidv4();
  timeline.push({
    id: followupId,
    date: formatDate(followupDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Thank You - ${job.title} Interview`,
    content: `Dear ${job.recruiter},\n\nI wanted to thank you and the team for the opportunity to interview for the ${job.title} position yesterday. I enjoyed our conversation and learning more about ${job.company}'s work in ${job.department}.\n\nI'm even more excited about the possibility of joining your team after our discussion. I believe my experience in ${candidate.skills.slice(0, 2).join(' and ')} aligns well with what you're looking for.\n\nI look forward to hearing about the next steps in the process.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter,
    metadata: {
      tags: ['Interview', 'Thank You']
    }
  });

  // Recruiter acknowledgment
  const ackDate = addHours(followupDate, 3);
  timeline.push({
    id: uuidv4(),
    date: formatDate(ackDate),
    time: formatTime(ackDate),
    type: 'email',
    channel: 'Email',
    subject: `Re: Thank You - ${job.title} Interview`,
    content: `Dear ${candidate.name},\n\nThank you for your email. It was a pleasure speaking with you as well. The team was impressed with your background and experience.\n\nWe're currently reviewing all candidates and expect to make a decision in the next few days. I'll be in touch soon with an update on next steps.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    relatedEvents: [followupId],
    metadata: {
      tags: ['Interview', 'Feedback']
    }
  });

  // Internal feedback (system note)
  const feedbackDate = addHours(ackDate, 6);
  timeline.push({
    id: uuidv4(),
    date: formatDate(feedbackDate),
    time: formatTime(feedbackDate),
    type: 'system',
    channel: 'Applicant Tracking System',
    subject: 'Interview Feedback Recorded',
    content: `Interview feedback submitted by ${job.hiringManager}.\nTechnical skills: ${candidate.interview?.aiAssessment?.technical || 85}%\nCommunication: ${candidate.interview?.aiAssessment?.communication || 90}%\nCultural fit: ${candidate.interview?.aiAssessment?.cultural || 88}%\nOverall: ${candidate.interview?.aiAssessment?.overall || 87}%\n\nComments: ${candidate.interview?.humanFeedback?.notes || 'Strong candidate with relevant experience. Good cultural fit. Recommend proceeding to next steps.'}`,
    direction: 'system',
    status: 'completed',
    metadata: {
      tags: ['Interview', 'Feedback', 'Internal'],
      interviewFeedback: {
        interviewer: job.hiringManager,
        decision: candidate.interview?.humanFeedback?.decision || 'Advance'
      }
    }
  });
}

function addPostInterviewRejectionCommunications(timeline: CommunicationEvent[], candidate: Candidate, job: Job, rejectDate: Date): void {
  // Rejection email after interview
  timeline.push({
    id: uuidv4(),
    date: formatDate(rejectDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Update on your application for ${job.title} at ${job.company}`,
    content: `Dear ${candidate.name},\n\nThank you for taking the time to interview for the ${job.title} position. We appreciate your interest in joining our team.\n\nAfter careful consideration, we have decided to proceed with another candidate whose skills and experience more closely align with our current needs.\n\nWe were impressed with your background and encourage you to apply for future positions that match your qualifications.\n\nWe wish you success in your job search and professional endeavors.\n\nBest regards,\n${job.recruiter}\n${job.company}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    metadata: {
      tags: ['Rejection', 'Post-Interview']
    }
  });

  // Candidate response to rejection
  const responseDate = addDays(rejectDate, 1);
  timeline.push({
    id: uuidv4(),
    date: formatDate(responseDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Re: Update on your application for ${job.title} at ${job.company}`,
    content: `Dear ${job.recruiter},\n\nThank you for letting me know about the decision regarding the ${job.title} position.\n\nWhile I'm disappointed, I appreciate the opportunity to have interviewed with ${job.company}. I would welcome any feedback you might have that could help me in my professional development.\n\nPlease keep me in mind for future opportunities that might be a better fit.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter,
    metadata: {
      tags: ['Rejection', 'Feedback Request']
    }
  });
}

function addEarlyRejectionCommunications(timeline: CommunicationEvent[], candidate: Candidate, job: Job, rejectDate: Date): void {
  // Early rejection email (after application review)
  timeline.push({
    id: uuidv4(),
    date: formatDate(rejectDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Regarding your application for ${job.title}`,
    content: `Dear ${candidate.name},\n\nThank you for your interest in the ${job.title} position at ${job.company}.\n\nAfter reviewing your application, we have determined that we will be moving forward with candidates whose qualifications more closely match our current requirements.\n\nWe appreciate your interest in ${job.company} and encourage you to apply for future positions that align with your skills and experience.\n\nBest regards,\n${job.recruiter}\n${job.company}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    metadata: {
      tags: ['Rejection', 'Application Stage']
    }
  });
}

function addOfferCommunications(timeline: CommunicationEvent[], candidate: Candidate, job: Job, offerDate: Date): void {
  // Internal approval email
  const approvalDate = addDays(offerDate, -2);
  const approvalId = uuidv4();
  
  timeline.push({
    id: approvalId,
    date: formatDate(approvalDate),
    time: '15:00',
    type: 'email',
    channel: 'Email',
    subject: `Offer Approval Request - ${candidate.name} for ${job.title}`,
    content: `Dear Hiring Team,\n\nI'm requesting approval to extend an offer to ${candidate.name} for the ${job.title} position. The candidate has successfully completed all assessment and interview stages, receiving positive feedback throughout the process.\n\nProposed Terms:\n- Base Salary: ${job.salary.currency}${job.salary.max}\n- Start Date: ${formatDate(addDays(offerDate, 14))}\n- Position: ${job.title}\n- Department: ${job.department}\n\nPlease review and approve at your earliest convenience.\n\nBest regards,\n${job.recruiter}`,
    direction: 'system',
    status: 'sent',
    sender: job.recruiter,
    recipient: 'Hiring Team',
    metadata: {
      tags: ['Offer', 'Approval Request']
    }
  });
  
  // Approval response
  const approvalResponseDate = addHours(approvalDate, 3);
  
  timeline.push({
    id: uuidv4(),
    date: formatDate(approvalResponseDate),
    time: formatTime(approvalResponseDate),
    type: 'email',
    channel: 'Email',
    subject: `Re: Offer Approval Request - ${candidate.name} for ${job.title}`,
    content: `Hi ${job.recruiter},\n\nI've reviewed the candidate's profile and interview feedback. I approve extending the offer to ${candidate.name} as proposed.\n\nThe candidate seems like a strong fit for our team, and I'm confident they will contribute significantly to our ${job.department} department.\n\nPlease proceed with extending the offer.\n\nRegards,\n${job.hiringManager}`,
    direction: 'system',
    status: 'read',
    sender: job.hiringManager,
    recipient: job.recruiter,
    relatedEvents: [approvalId],
    metadata: {
      tags: ['Offer', 'Approval']
    }
  });
  
  // Offer call via phone
  const offerCallDate = addHours(offerDate, -4);
  const offerCallId = uuidv4();
  
  timeline.push({
    id: offerCallId,
    date: formatDate(offerCallDate),
    time: formatTime(offerCallDate),
    type: 'phone',
    channel: 'Phone',
    subject: 'Offer Discussion Call',
    content: `Called ${candidate.name} to discuss the job offer for the ${job.title} position. Explained the compensation package, benefits, and proposed start date. The candidate expressed enthusiasm about the opportunity and requested the formal offer letter via email to review the details.`,
    direction: 'outbound',
    status: 'completed',
    sender: job.recruiter,
    recipient: candidate.name,
    metadata: {
      duration: '15 minutes',
      tags: ['Offer', 'Phone Call']
    }
  });
  
  // Offer letter email
  const offerEmailId = uuidv4();
  
  timeline.push({
    id: offerEmailId,
    date: formatDate(offerDate),
    time: '10:00',
    type: 'email',
    channel: 'Email',
    subject: `Offer Letter - ${job.title} at ${job.company}`,
    content: `Dear ${candidate.name},\n\nFollowing our conversation, I'm pleased to formally offer you the position of ${job.title} at ${job.company}.\n\nAs discussed, here are the details of our offer:\n\n- Base Salary: ${job.salary.currency}${job.salary.max} per annum\n- Start Date: ${formatDate(addDays(offerDate, 14))}\n- Position: ${job.title}\n- Department: ${job.department}\n- Location: ${job.location}\n\nAdditional benefits include:\n${job.benefits.slice(0, 3).map(benefit => `- ${benefit}`).join('\n')}\n\nPlease find attached the formal offer letter and employment contract for your review. To accept this offer, please sign and return the documents by ${formatDate(addDays(offerDate, 5))}.\n\nIf you have any questions or need clarification on any aspect of the offer, please don't hesitate to contact me.\n\nWe're excited about the possibility of you joining our team!\n\nBest regards,\n${job.recruiter}\n${job.company}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    relatedEvents: [offerCallId],
    attachments: [
      {
        name: 'Offer_Letter.pdf',
        type: 'application/pdf',
        size: '450 KB'
      },
      {
        name: 'Employment_Contract.pdf',
        type: 'application/pdf',
        size: '750 KB'
      }
    ],
    metadata: {
      tags: ['Offer', 'Official Documentation']
    }
  });
  
  // WhatsApp acknowledgment of offer
  const whatsappAckDate = addHours(offerDate, 3);
  
  timeline.push({
    id: uuidv4(),
    date: formatDate(whatsappAckDate),
    time: formatTime(whatsappAckDate),
    type: 'message',
    channel: 'WhatsApp',
    subject: 'Offer Acknowledgment',
    content: `Hi ${job.recruiter}, I've received the offer letter for the ${job.title} position. Thank you! I'm reviewing the details and will get back to you within a couple of days. The opportunity looks very exciting!`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.name,
    recipient: job.recruiter,
    relatedEvents: [offerEmailId],
    metadata: {
      tags: ['Offer', 'Acknowledgment', 'WhatsApp']
    }
  });
}

function addHiredCommunications(timeline: CommunicationEvent[], candidate: Candidate, job: Job, responseDate: Date): void {
  // Offer acceptance email
  const acceptanceId = uuidv4();
  
  timeline.push({
    id: acceptanceId,
    date: formatDate(responseDate),
    time: '11:30',
    type: 'email',
    channel: 'Email',
    subject: `Acceptance of Offer - ${job.title}`,
    content: `Dear ${job.recruiter},\n\nI am writing to formally accept the offer for the position of ${job.title} at ${job.company}.\n\nI am excited to join the team and contribute to the company's success. I look forward to starting on ${formatDate(addDays(responseDate, 14))} as proposed.\n\nPlease find attached the signed offer letter and employment contract.\n\nThank you for this opportunity. I'm looking forward to being part of ${job.company}.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter,
    attachments: [
      {
        name: 'Signed_Offer_Letter.pdf',
        type: 'application/pdf',
        size: '460 KB'
      },
      {
        name: 'Signed_Employment_Contract.pdf',
        type: 'application/pdf',
        size: '770 KB'
      }
    ],
    metadata: {
      tags: ['Offer', 'Acceptance']
    }
  });
  
  // Acceptance confirmation
  const confirmationDate = addHours(responseDate, 2);
  const confirmationId = uuidv4();
  
  timeline.push({
    id: confirmationId,
    date: formatDate(confirmationDate),
    time: formatTime(confirmationDate),
    type: 'email',
    channel: 'Email',
    subject: `Welcome to ${job.company}!`,
    content: `Dear ${candidate.name},\n\nThank you for accepting our offer for the ${job.title} position. We're thrilled to have you joining the ${job.company} team!\n\nI've received your signed documents and everything is in order. Your start date is confirmed for ${formatDate(addDays(responseDate, 14))}.\n\nIn the coming days, you'll receive information from our HR department regarding onboarding details, including what to expect on your first day, required documentation, and other important information.\n\nIn the meantime, if you have any questions, please don't hesitate to reach out to me directly.\n\nWe're looking forward to working with you!\n\nBest regards,\nSarah Johnson\nHR Manager\n${job.company}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    relatedEvents: [acceptanceId],
    metadata: {
      tags: ['Welcome', 'Confirmation']
    }
  });
  
  // HR onboarding email
  const onboardingDate = addDays(responseDate, 5);
  
  timeline.push({
    id: uuidv4(),
    date: formatDate(onboardingDate),
    time: '14:00',
    type: 'email',
    channel: 'Email',
    subject: `Onboarding Information - ${job.title}`,
    content: `Dear ${candidate.name},\n\nCongratulations on joining ${job.company} as our new ${job.title}! We're preparing for your arrival on ${formatDate(addDays(responseDate, 14))}.\n\nTo help you prepare for your first day, please find attached an onboarding package containing:\n- First day schedule and information\n- Required documentation checklist\n- Benefits enrollment forms\n- Company policies handbook\n- IT setup information\n\nPlease complete the enclosed forms and return them by ${formatDate(addDays(onboardingDate, 5))} to ensure a smooth onboarding process.\n\nOn your first day, please arrive at our ${job.location} office at 9:00 AM. Ask for me at the reception desk, and I'll be there to welcome you.\n\nIf you have any questions before your start date, please contact me at hr@${job.company.toLowerCase().replace(/ /g, '')}.com.\n\nWe're excited to have you on board!\n\nBest regards,\nSarah Johnson\nHR Manager\n${job.company}`,
    direction: 'outbound',
    status: 'sent',
    sender: `HR@${job.company.toLowerCase().replace(/ /g, '')}.com`,
    recipient: candidate.email,
    relatedEvents: [confirmationId],
    attachments: [
      {
        name: 'Onboarding_Package.pdf',
        type: 'application/pdf',
        size: '1.8 MB'
      }
    ],
    metadata: {
      tags: ['Onboarding', 'HR']
    }
  });
  
  // Candidate's excited WhatsApp message
  const excitedMsgDate = addHours(onboardingDate, 5);
  
  timeline.push({
    id: uuidv4(),
    date: formatDate(excitedMsgDate),
    time: formatTime(excitedMsgDate),
    type: 'message',
    channel: 'WhatsApp',
    subject: 'Pre-start Excitement',
    content: `Hi ${job.recruiter}! Just received the onboarding package. I'm really excited to join the team! Already working on the forms and can't wait to get started. Thanks for all your help throughout the process.`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.name,
    recipient: job.recruiter,
    metadata: {
      tags: ['Onboarding', 'Excitement', 'WhatsApp']
    }
  });
}

function addRejectedOfferCommunications(timeline: CommunicationEvent[], candidate: Candidate, job: Job, responseDate: Date): void {
  // Offer rejection email
  const rejectionId = uuidv4();
  
  timeline.push({
    id: rejectionId,
    date: formatDate(responseDate),
    time: '15:45',
    type: 'email',
    channel: 'Email',
    subject: `Regarding the ${job.title} Position Offer`,
    content: `Dear ${job.recruiter},\n\nThank you for the offer for the ${job.title} position at ${job.company}. I truly appreciate the opportunity and the time you and your team have invested in my candidacy.\n\nAfter careful consideration, I regret to inform you that I must decline the offer at this time. While ${job.company} is an excellent organization with an impressive mission, I have decided to accept another position that better aligns with my career goals in the immediate term.\n\nI want to express my sincere gratitude for your consideration and for the professional manner in which the recruitment process was conducted. I was impressed by the team and company culture, and I hope our paths may cross again in the future.\n\nThank you again for your time and consideration.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter,
    metadata: {
      tags: ['Offer', 'Rejection']
    }
  });
  
  // WhatsApp follow-up from candidate
  const whatsappFollowupDate = addHours(responseDate, 1);
  
  timeline.push({
    id: uuidv4(),
    date: formatDate(whatsappFollowupDate),
    time: formatTime(whatsappFollowupDate),
    type: 'message',
    channel: 'WhatsApp',
    subject: 'Offer Decision Follow-up',
    content: `Hi ${job.recruiter}, I just sent you an email regarding the offer. I wanted to personally thank you for everything. It was a difficult decision, and I was truly impressed with ${job.company}. I hope we can stay in touch.`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.name,
    recipient: job.recruiter,
    relatedEvents: [rejectionId],
    metadata: {
      tags: ['Offer', 'Rejection', 'WhatsApp']
    }
  });
  
  // Response to rejection
  const responseEmailDate = addHours(responseDate, 3);
  
  timeline.push({
    id: uuidv4(),
    date: formatDate(responseEmailDate),
    time: formatTime(responseEmailDate),
    type: 'email',
    channel: 'Email',
    subject: `Re: Regarding the ${job.title} Position Offer`,
    content: `Dear ${candidate.name},\n\nThank you for letting us know about your decision regarding our offer for the ${job.title} position. While we are disappointed that you won't be joining us at this time, we understand and respect your decision to pursue an opportunity that better aligns with your career goals.\n\nWe've been impressed by your qualifications and professional approach throughout the selection process, and we would be happy to consider you for future opportunities that might be a better fit.\n\nThank you again for your interest in ${job.company}, and we wish you all the best in your new role and future endeavors.\n\nPlease don't hesitate to stay in touch.\n\nBest regards,\n${job.recruiter}\n${job.company}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    relatedEvents: [rejectionId],
    metadata: {
      tags: ['Response to Rejection', 'Professional']
    }
  });
  
  // Internal note about rejection
  const internalNoteDate = addHours(responseEmailDate, 1);
  
  timeline.push({
    id: uuidv4(),
    date: formatDate(internalNoteDate),
    time: formatTime(internalNoteDate),
    type: 'note',
    channel: 'Internal Note',
    subject: 'Candidate Rejected Offer',
    content: `${candidate.name} has declined our offer for the ${job.title} position. The candidate cited another opportunity better aligned with their career goals. Given the candidate's strong performance throughout our process, recommend keeping their profile active in our database for future opportunities. Will discuss with hiring manager about proceeding with the next shortlisted candidate or reopening the search.`,
    direction: 'system',
    status: 'completed',
    sender: job.recruiter,
    metadata: {
      tags: ['Offer', 'Rejected', 'Next Steps']
    }
  });
}

// Add a function for rejections after assessment
function addPostAssessmentRejectionCommunications(timeline: CommunicationEvent[], candidate: Candidate, job: Job, rejectDate: Date): void {
  // Rejection email after assessment
  const rejectionId = uuidv4();
  timeline.push({
    id: rejectionId,
    date: formatDate(rejectDate),
    time: '14:30',
    type: 'email',
    channel: 'Email',
    subject: `Update on your application for ${job.title} at ${job.company}`,
    content: `Dear ${candidate.name},\n\nThank you for taking the time to complete the assessment for the ${job.title} position. We appreciate your interest in joining our team.\n\nAfter reviewing your assessment results along with your overall application, we have decided to proceed with other candidates whose skills and experience more closely align with our current requirements for this role.\n\nWe were impressed with several aspects of your profile and encourage you to apply for future positions that match your qualifications.\n\nWe wish you all the best in your job search and professional endeavors.\n\nBest regards,\n${job.recruiter}\n${job.company}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    metadata: {
      tags: ['Rejection', 'Post-Assessment']
    }
  });

  // Candidate response to rejection (70% chance they respond)
  if (Math.random() > 0.3) {
    const responseDate = addDays(rejectDate, 1);
    timeline.push({
      id: uuidv4(),
      date: formatDate(responseDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Re: Update on your application for ${job.title} at ${job.company}`,
      content: `Dear ${job.recruiter},\n\nThank you for letting me know about the decision regarding the ${job.title} position.\n\nI appreciate the opportunity to have participated in your recruitment process. While I'm disappointed with the outcome, I would value any feedback on my assessment that could help me improve.\n\nPlease keep me in mind for future opportunities that might better match my skill set.\n\nBest regards,\n${candidate.name}`,
      direction: 'inbound',
      status: 'read',
      sender: candidate.email,
      recipient: job.recruiter,
      relatedEvents: [rejectionId],
      metadata: {
        tags: ['Rejection', 'Feedback Request']
      }
    });
  }
} 