import { Candidate, Job, RecruitmentStage, CommunicationEvent } from '@/types';

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const addDays = (date: Date, days: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

// Generate a random time between min and max hours
const randomTime = (minHour = 9, maxHour = 17) => {
  const hour = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;
  const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

// Randomly select from an array
const randomSelect = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const generateCommunicationTimeline = (candidate: Candidate, job: Job): CommunicationEvent[] => {
  const timeline: CommunicationEvent[] = [];
  
  // Determine if this is a HireHub outreach case
  const isHireHubSource = candidate.source === 'HireHub';
  
  // Start date will be 14 days before application date for outreach
  // But we need to make sure we're not generating dates too far in the past
  const applicationDate = new Date(candidate.appliedDate);
  
  // Ensure we don't go back more than 60 days from today
  const today = new Date();
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(today.getDate() - 60);
  
  // For outreach, go back 14 days from application date, but no earlier than 60 days ago
  let startDate = addDays(applicationDate, -14);
  if (startDate < sixtyDaysAgo) {
    startDate = new Date(sixtyDaysAgo);
  }
  
  let currentDate = new Date(startDate);
  let eventCounter = 1;
  
  // =============== OUTREACH STAGE (All candidates) ===============
  // Initial outreach message
  const outreachChannels = [
    { type: 'email' as const, channel: 'Email' },
    { type: 'linkedin' as const, channel: 'LinkedIn' },
    { type: 'whatsapp' as const, channel: 'WhatsApp' }
  ];
  
  // For HireHub sources, use only Email or WhatsApp with 50/50 chance
  let initialChannel = randomSelect(outreachChannels);
  if (isHireHubSource) {
    // 50% WhatsApp, 50% Email for HireHub sources
    initialChannel = Math.random() < 0.5 
      ? { type: 'whatsapp' as const, channel: 'WhatsApp' }
      : { type: 'email' as const, channel: 'Email' };
  }
  
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(),
    type: initialChannel.type,
    channel: initialChannel.channel,
    subject: `Opportunity at ${job.company} - ${job.title}`,
    content: `Hi ${candidate.name},\n\nI hope this message finds you well. I'm ${job.recruiter}, a recruiter at ${job.company}.\n\nI came across your profile and was impressed by your experience at ${candidate.currentCompany} as a ${candidate.currentTitle}. We're currently looking for a ${job.title} and I believe your skills and experience would make you a great fit for our team.\n\nWould you be interested in learning more about this opportunity?\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  // If the candidate is only in the OUTREACHED stage or has HireHub source, we always show outreach-first pattern
  if (candidate.stage === RecruitmentStage.OUTREACHED || isHireHubSource) {
    // Make sure we're not going beyond application date with follow-ups
    if (addDays(currentDate, 3) < applicationDate) {
      // Make sure follow-up doesn't go beyond application date
    if (addDays(currentDate, 3) < applicationDate) {
      currentDate = addDays(currentDate, 3);
    } else {
      currentDate = addDays(applicationDate, -1); // One day before application
    }
    } else {
      currentDate = addDays(applicationDate, -1); // One day before application
    }
    
    // Add a follow-up outreach using the same channel
    timeline.push({
      id: `${candidate.id}-${eventCounter++}`,
      date: formatDate(currentDate),
      time: randomTime(),
      type: initialChannel.type,
      channel: initialChannel.channel,
      subject: `Following up: Opportunity at ${job.company}`,
      content: `Hi ${candidate.name},\n\nI hope you're doing well. I wanted to follow up on my previous message about the ${job.title} position at ${job.company}.\n\nWe believe you would be a great addition to our team based on your experience at ${candidate.currentCompany}. If you're interested in learning more, please let me know.\n\nBest regards,\n${job.recruiter}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.email
    });
    
    // If truly in OUTREACHED stage, return here - no candidate responses
    if (candidate.stage === RecruitmentStage.OUTREACHED) {
      return timeline;
    }
    
    // For HireHub sources in later stages, continue with more outreach attempts
    if (isHireHubSource) {
      // Ensure we're not going beyond application date
      if (addDays(currentDate, 4) < applicationDate) {
        // Ensure third message doesn't exceed application date
    if (addDays(currentDate, 4) < applicationDate) {
      currentDate = addDays(currentDate, 4);
    } else {
      currentDate = new Date(applicationDate); // Use application date
    }
      } else {
        currentDate = new Date(applicationDate); // Use application date
      }
      
      // Try a different channel for the third attempt if was using email before
      const thirdChannel = initialChannel.type === 'email' 
        ? { type: 'whatsapp' as const, channel: 'WhatsApp' }
        : initialChannel;
      
      timeline.push({
        id: `${candidate.id}-${eventCounter++}`,
        date: formatDate(currentDate),
        time: randomTime(),
        type: thirdChannel.type,
        channel: thirdChannel.channel,
        subject: `One more follow-up: ${job.title} at ${job.company}`,
        content: `Hello ${candidate.name},\n\nI hope this message finds you well. I wanted to reach out one final time regarding the ${job.title} role at ${job.company}.\n\nBased on your background at ${candidate.currentCompany}, I believe this could be a great opportunity for you. If you're interested in learning more, please let me know.\n\nBest regards,\n${job.recruiter}`,
        direction: 'outbound',
        status: 'sent',
        sender: job.recruiter,
        recipient: candidate.email
      });
    }
  }
  
  // For stages beyond OUTREACHED and non-HireHub sources, add candidate response
  // Add 1-2 days for candidate response
  currentDate = addDays(currentDate, 1 + Math.floor(Math.random() * 2));
  
  // Candidate response to outreach
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(),
    type: initialChannel.type,
    channel: initialChannel.channel,
    subject: `Re: Opportunity at ${job.company} - ${job.title}`,
    content: `Hello ${job.recruiter},\n\nThank you for reaching out. I'm definitely interested in learning more about the ${job.title} position at ${job.company}.\n\nCould you share more details about the role and the team?\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter
  });
  
  // Add 1 day for recruiter follow-up
  currentDate = addDays(currentDate, 1);
  
  // Recruiter provides more details
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(),
    type: initialChannel.type,
    channel: initialChannel.channel,
    subject: `Re: Opportunity at ${job.company} - ${job.title}`,
    content: `Hi ${candidate.name},\n\nGreat to hear from you! I'd be happy to share more details about the ${job.title} role.\n\nThe position involves: ${job.responsibilities.slice(0, 2).join(', ')}.\n\nWe're looking for someone with: ${job.requirements.slice(0, 2).join(', ')}.\n\nThe team is growing quickly, and this role offers excellent opportunities for career growth. Would you be interested in applying?\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  // Add 1-2 days for candidate to express interest
  currentDate = addDays(currentDate, 1 + Math.floor(Math.random() * 2));
  
  // Candidate expresses interest in applying
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(),
    type: initialChannel.type,
    channel: initialChannel.channel,
    subject: `Re: Opportunity at ${job.company} - ${job.title}`,
    content: `Hello ${job.recruiter},\n\nThank you for sharing these details. The role sounds very interesting and aligns well with my experience and career goals.\n\nI would definitely like to apply. What are the next steps?\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter
  });
  
  // =============== APPLICATION STAGE ===============
  // Fast forward to the application date
  currentDate = new Date(applicationDate);
  
  // For HireHub sources, this is the point where the candidate officially enters the system
  const appChannel = isHireHubSource ? initialChannel : { type: 'system' as const, channel: 'Application Portal' };
  
  // Application received
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(9, 13),
    type: appChannel.type,
    channel: appChannel.channel,
    subject: 'Application Submitted',
    content: `${candidate.name} submitted an application for the ${job.title} position${isHireHubSource ? ' following our outreach' : ''}`,
    direction: 'system',
    status: 'completed',
    metadata: {
      jobId: job.id,
      source: candidate.source
    }
  });
  
  // Automated application confirmation
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(9, 13),
    type: 'email',
    channel: 'Email',
    subject: `Application Received - ${job.title} at ${job.company}`,
    content: `Dear ${candidate.name},\n\nThank you for applying for the ${job.title} position at ${job.company}. We have received your application and our recruitment team will review it shortly.\n\nWe will be in touch with you regarding the next steps.\n\nBest regards,\n${job.company} Recruitment Team`,
    direction: 'outbound',
    status: 'sent',
    sender: `careers@${job.company.toLowerCase().replace(/\s+/g, '')}.com`,
    recipient: candidate.email
  });
  
  // If candidate is only at APPLIED stage, stop here
  if (candidate.stage === RecruitmentStage.APPLIED) {
    return timeline;
  }
  
  // =============== SHORTLISTING STAGE ===============
  // Add 2-3 days for application review
  currentDate = addDays(currentDate, 2 + Math.floor(Math.random() * 2));
  
  // Application shortlisted notification
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Application Update - ${job.title} at ${job.company}`,
    content: `Dear ${candidate.name},\n\nI'm pleased to inform you that your application for the ${job.title} position has been shortlisted.\n\nOur team was impressed by your experience and skills, particularly in ${Array.isArray(candidate.skills) && candidate.skills.length > 0 ? 
      (typeof candidate.skills[0] === 'string' 
        ? (candidate.skills as string[]).slice(0, 2).join(', ') 
        : (candidate.skills as { name: string }[]).slice(0, 2).map(s => s.name).join(', ')) 
      : 'your field'}.\n\nAs a next step, we'd like to invite you to complete a technical assessment to further evaluate your skills.\n\nPlease click the link below to access the assessment:\n[Assessment Link]\n\nThe assessment should take approximately 60-90 minutes to complete. Please complete it within the next 3 days.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  // Add 1-2 days for completing assessment
  currentDate = addDays(currentDate, 1 + Math.floor(Math.random() * 2));
  
  // Assessment completed
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(),
    type: 'assessment',
    channel: 'Assessment Platform',
    subject: 'Technical Assessment Completed',
    content: `${candidate.name} has completed the technical assessment for the ${job.title} position.`,
    direction: 'system',
    status: 'completed',
    metadata: {
      score: candidate.assessment?.score || 85,
      duration: '78 minutes',
      completedSections: ['Technical Knowledge', 'Problem Solving', 'Code Quality']
    }
  });
  
  // Add 1 day for assessment review
  currentDate = addDays(currentDate, 1);
  
  // Assessment feedback
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Assessment Results - ${job.title} at ${job.company}`,
    content: `Dear ${candidate.name},\n\nThank you for completing the technical assessment for the ${job.title} position.\n\nI'm pleased to inform you that you performed well on the assessment. Our team was particularly impressed with your problem-solving skills and technical knowledge.\n\nWe would like to move forward with the next stage of the interview process.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  // If candidate is only at SHORTLISTED stage, stop here
  if (candidate.stage === RecruitmentStage.SHORTLISTED) {
    return timeline;
  }
  
  // =============== INTERVIEW STAGE ===============
  // Add 1 day for interview scheduling
  currentDate = addDays(currentDate, 1);
  
  // Schedule interview
  // Ensure interview date is reasonable and recent
    const maxInterviewDate = addDays(new Date(), -3); // No more than 3 days ago
    const suggestedInterviewDate = addDays(currentDate, 3);
    const interviewDate = suggestedInterviewDate > maxInterviewDate ? suggestedInterviewDate : maxInterviewDate;
  const interviewTime = randomTime(10, 15);
  
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Interview Invitation - ${job.title} at ${job.company}`,
    content: `Dear ${candidate.name},\n\nI would like to invite you for an interview for the ${job.title} position at ${job.company}.\n\nProposed date and time: ${formatDate(interviewDate)} at ${interviewTime}\n\nThe interview will be conducted by ${job.hiringManager}, our ${job.department} Manager, and will last approximately 60 minutes.\n\nPlease confirm if this time works for you.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  // Add same day for response
  const interviewConfirmationTime = randomTime(parseInt(interviewTime.split(':')[0]) + 1, 17);
  
  // Candidate confirms interview
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: interviewConfirmationTime,
    type: 'email',
    channel: 'Email',
    subject: `Re: Interview Invitation - ${job.title} at ${job.company}`,
    content: `Dear ${job.recruiter},\n\nThank you for the interview invitation. I confirm that I am available on ${formatDate(interviewDate)} at ${interviewTime}.\n\nI'm looking forward to discussing the opportunity further.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter
  });
  
  // Calendar invitation
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(parseInt(interviewConfirmationTime.split(':')[0]) + 1, 17),
    type: 'calendar',
    channel: 'Google Calendar',
    subject: `Interview: ${candidate.name} - ${job.title}`,
    content: `Interview for ${job.title} position\nCandidate: ${candidate.name}\nInterviewer: ${job.hiringManager}\nLocation: Google Meet/Zoom\nDuration: 60 minutes`,
    direction: 'outbound',
    status: 'scheduled',
    sender: job.recruiter,
    recipient: candidate.email,
    metadata: {
      meetLink: 'https://meet.google.com/abc-defg-hij',
      duration: '60 minutes',
      attendees: [job.hiringManager, job.recruiter, candidate.email]
    }
  });
  
  // Add 1 day before interview for prep email
  currentDate = addDays(interviewDate, -1);
  
  // Interview prep email
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Interview Preparation - ${job.title} at ${job.company}`,
    content: `Dear ${candidate.name},\n\nI wanted to touch base before your interview tomorrow for the ${job.title} position.\n\nThe interview will be conducted via ${Math.random() > 0.5 ? 'Google Meet' : 'Zoom'} at ${interviewTime}. Please use the link provided in the calendar invitation.\n\nYou'll be meeting with ${job.hiringManager}, who is looking forward to discussing your experience and how it relates to the role.\n\nPlease let me know if you have any questions before the interview.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  // Move to interview date
  currentDate = new Date(interviewDate);
  
  // Interview completion
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: interviewTime,
    type: 'interview',
    channel: Math.random() > 0.5 ? 'Google Meet' : 'Zoom',
    subject: `Interview - ${job.title}`,
    content: `Interview conducted with ${candidate.name} for the ${job.title} position. The candidate demonstrated strong knowledge in key areas and responded well to technical questions.`,
    direction: 'system',
    status: 'completed',
    metadata: {
      duration: '65 minutes',
      interviewers: [job.hiringManager],
      overallImpression: 'Positive',
      technicalScore: Math.floor(Math.random() * 20) + 80,
      culturalFitScore: Math.floor(Math.random() * 20) + 80
    }
  });
  
  // Post-interview thank you
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(parseInt(interviewTime.split(':')[0]) + 2, 17),
    type: 'email',
    channel: 'Email',
    subject: `Thank You - Interview for ${job.title}`,
    content: `Dear ${job.hiringManager},\n\nThank you for taking the time to interview me today for the ${job.title} position at ${job.company}.\n\nI enjoyed our conversation and learning more about the role and the team. The projects you mentioned about ${Math.random() > 0.5 ? 'improving customer experience' : 'streamlining internal processes'} sound particularly interesting.\n\nI am excited about the possibility of joining your team and contributing to ${job.company}'s success.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.hiringManager
  });
  
  // Add 1 day for interview follow-up
  currentDate = addDays(currentDate, 1);
  
  // Interview follow-up
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Interview Follow-Up - ${job.title}`,
    content: `Dear ${candidate.name},\n\nThank you for taking the time to interview with us yesterday. ${job.hiringManager} was impressed with your background and the insights you shared.\n\nWe are still in the process of interviewing other candidates and expect to make a decision soon. I'll keep you updated on the status of your application.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  // If candidate is only at INTERVIEWED stage, stop here
  if (candidate.stage === RecruitmentStage.INTERVIEWED) {
    return timeline;
  }
  
  // =============== OFFER STAGES ===============
  // Add 3-4 days for decision making
  currentDate = addDays(currentDate, 3 + Math.floor(Math.random() * 2));
  
  // Offer preparation
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(9, 11),
    type: 'system',
    channel: 'Internal',
    subject: `Offer Approval - ${candidate.name}`,
    content: `Offer for ${candidate.name} for the ${job.title} position has been approved.\nBase Salary: ${job.salary.currency} ${job.salary.min + Math.floor(Math.random() * (job.salary.max - job.salary.min))}\nStart Date: To be determined`,
    direction: 'system',
    status: 'completed',
    metadata: {
      approvedBy: job.hiringManager,
      requestedBy: job.recruiter
    }
  });
  
  // Offer call
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(11, 12),
    type: 'phone',
    channel: 'Phone',
    subject: 'Offer Discussion',
    content: `${job.recruiter} called ${candidate.name} to discuss the job offer details for the ${job.title} position.`,
    direction: 'outbound',
    status: 'completed',
    sender: job.recruiter,
    recipient: candidate.name,
    metadata: {
      duration: '15 minutes',
      outcome: 'Positive, candidate interested in receiving offer'
    }
  });
  
  // Offer email
  timeline.push({
    id: `${candidate.id}-${eventCounter++}`,
    date: formatDate(currentDate),
    time: randomTime(14, 15),
    type: 'email',
    channel: 'Email',
    subject: `Job Offer - ${job.title} at ${job.company}`,
    content: `Dear ${candidate.name},\n\nI am delighted to offer you the position of ${job.title} at ${job.company}.\n\nFollowing our conversation earlier today, please find attached the formal offer letter with all details including compensation, benefits, and proposed start date.\n\nPlease review the offer and let me know if you have any questions. We would appreciate your response within the next 5 business days.\n\nWe are excited about the possibility of you joining our team.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    attachments: [{
      name: `${job.company}_Offer_Letter_${candidate.name.replace(/\s+/g, '_')}.pdf`,
      type: 'application/pdf',
      size: '456 KB'
    }]
  });
  
  // If candidate is only at OFFER_EXTENDED stage, stop here
  if (candidate.stage === RecruitmentStage.OFFER_EXTENDED) {
    return timeline;
  }
  
  // Add 2-3 days for candidate deliberation
  currentDate = addDays(currentDate, 2 + Math.floor(Math.random() * 2));
  
  // For OFFER_REJECTED stage
  if (candidate.stage === RecruitmentStage.OFFER_REJECTED) {
    // Candidate rejects offer
    timeline.push({
      id: `${candidate.id}-${eventCounter++}`,
      date: formatDate(currentDate),
      time: randomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Re: Job Offer - ${job.title} at ${job.company}`,
      content: `Dear ${job.recruiter},\n\nThank you very much for offering me the position of ${job.title} at ${job.company}.\n\nAfter careful consideration, I have decided to decline the offer as I have accepted another position that better aligns with my career goals at this time.\n\nI appreciate the opportunity and the time you have invested in the interview process. It was a pleasure learning about ${job.company} and the team.\n\nBest regards,\n${candidate.name}`,
      direction: 'inbound',
      status: 'read',
      sender: candidate.email,
      recipient: job.recruiter
    });
    
    // Recruiter acknowledgment
    timeline.push({
      id: `${candidate.id}-${eventCounter++}`,
      date: formatDate(addDays(currentDate, 1)),
      time: randomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Re: Job Offer - ${job.title} at ${job.company}`,
      content: `Dear ${candidate.name},\n\nThank you for letting me know about your decision and for your kind words about our company.\n\nWhile we are disappointed, we understand that you need to make the best decision for your career. We wish you all the best in your new role.\n\nPlease feel free to stay in touch, and perhaps our paths will cross again in the future.\n\nBest regards,\n${job.recruiter}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.email
    });
    
    return timeline;
  }
  
  // For HIRED stage
  if (candidate.stage === RecruitmentStage.HIRED) {
    // Candidate accepts offer
    timeline.push({
      id: `${candidate.id}-${eventCounter++}`,
      date: formatDate(currentDate),
      time: randomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Re: Job Offer - ${job.title} at ${job.company}`,
      content: `Dear ${job.recruiter},\n\nI am pleased to accept the job offer for the position of ${job.title} at ${job.company}.\n\nI've attached the signed offer letter for your records. As discussed, I can start on ${formatDate(addDays(currentDate, 14))}.\n\nI'm excited to join the team and contribute to ${job.company}'s success.\n\nBest regards,\n${candidate.name}`,
      direction: 'inbound',
      status: 'read',
      sender: candidate.email,
      recipient: job.recruiter,
      attachments: [{
        name: `Signed_Offer_Letter_${candidate.name.replace(/\s+/g, '_')}.pdf`,
        type: 'application/pdf',
        size: '458 KB'
      }]
    });
    
    // Welcome email
    timeline.push({
      id: `${candidate.id}-${eventCounter++}`,
      date: formatDate(addDays(currentDate, 1)),
      time: randomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Welcome to ${job.company}!`,
      content: `Dear ${candidate.name},\n\nThank you for accepting our offer! We're thrilled to have you join the ${job.company} team as a ${job.title}.\n\nTo help you prepare for your first day on ${formatDate(addDays(currentDate, 14))}, I've attached our onboarding guide with helpful information about our office, what to bring, and what to expect.\n\nIn the coming days, someone from our HR team will reach out to you with additional paperwork and to answer any questions you may have.\n\nWelcome aboard!\n\nBest regards,\n${job.recruiter}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.email,
      attachments: [{
        name: 'Onboarding_Guide.pdf',
        type: 'application/pdf',
        size: '1.2 MB'
      }]
    });
    
    // Onboarding communication
    timeline.push({
      id: `${candidate.id}-${eventCounter++}`,
      date: formatDate(addDays(currentDate, 3)),
      time: randomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Onboarding Details - ${job.company}`,
      content: `Dear ${candidate.name},\n\nI hope this email finds you well. I'm from the HR team at ${job.company}, and I'll be helping with your onboarding process.\n\nPlease find attached the necessary forms that need to be completed before your start date. These include tax forms, direct deposit information, and our employee handbook.\n\nIf you have any questions, please don't hesitate to reach out.\n\nWe're looking forward to having you join us!\n\nBest regards,\nHR Team\n${job.company}`,
      direction: 'outbound',
      status: 'sent',
      sender: `hr@${job.company.toLowerCase().replace(/\s+/g, '')}.com`,
      recipient: candidate.email,
      attachments: [{
        name: 'Onboarding_Forms.pdf',
        type: 'application/pdf',
        size: '890 KB'
      }]
    });
  }
  
  // For REJECTED
  if (candidate.stage === RecruitmentStage.REJECTED) {
    // Rejection after interview
    timeline.push({
      id: `${candidate.id}-${eventCounter++}`,
      date: formatDate(currentDate),
      time: randomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Update on your application for ${job.title}`,
      content: `Dear ${candidate.name},\n\nThank you for taking the time to interview for the ${job.title} position at ${job.company}.\n\nAfter careful consideration, we have decided to move forward with other candidates whose qualifications more closely align with our current needs.\n\nWe appreciate your interest in ${job.company} and wish you success in your job search.\n\nBest regards,\n${job.recruiter}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.email
    });
  }
  
  return timeline;
}; 