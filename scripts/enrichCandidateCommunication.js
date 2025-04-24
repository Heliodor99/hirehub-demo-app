const { candidates } = require('../src/data/candidates');
const { jobs } = require('../src/data/jobs');
const { RecruitmentStage } = require('../src/types');
const fs = require('fs');
const path = require('path');

// Helper functions
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const getRandomTime = () => {
  const hours = Math.floor(Math.random() * 11) + 9; // 9 AM to 7 PM
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Function to generate outreach message
const generateOutreachMessage = (candidate, job) => {
  const platforms = ['LinkedIn', 'Email', 'WhatsApp'];
  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  
  const messages = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 2); // Start outreach 2 months ago
  const outreachDate = formatDate(startDate);
  const outreachTime = getRandomTime();
  
  // Outreach message
  messages.push({
    id: `${candidate.id}-outreach-1`,
    date: outreachDate,
    time: outreachTime,
    type: platform.toLowerCase(),
    channel: platform,
    subject: `Opportunity: ${job.title} at ${job.company}`,
    content: `Hi ${candidate.name},\n\nI'm ${job.recruiter} from ${job.company}. We're looking for a ${job.title} and your profile caught my attention. Based on your experience at ${candidate.currentCompany}, I think you'd be a great fit for our team.\n\nWould you be interested in learning more about this opportunity?\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    metadata: {
      platform: platform
    }
  });
  
  // Candidate response (if they moved beyond outreach)
  if (candidate.stage !== RecruitmentStage.OUTREACHED) {
    const responseDate = addDays(startDate, 1);
    messages.push({
      id: `${candidate.id}-outreach-2`,
      date: formatDate(responseDate),
      time: getRandomTime(),
      type: platform.toLowerCase(),
      channel: platform,
      subject: `Re: Opportunity: ${job.title} at ${job.company}`,
      content: `Hi ${job.recruiter},\n\nThank you for reaching out! I'm definitely interested in learning more about the ${job.title} position at ${job.company}.\n\nI'm currently looking for new opportunities where I can leverage my experience in ${candidate.skills.slice(0, 3).join(', ')}.\n\nCould you share more details about the role and team?\n\nBest regards,\n${candidate.name}`,
      direction: 'inbound',
      status: 'read',
      sender: candidate.email,
      recipient: job.recruiter
    });
    
    // Recruiter follow-up with more information
    const followUpDate = addDays(responseDate, 1);
    messages.push({
      id: `${candidate.id}-outreach-3`,
      date: formatDate(followUpDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: `${job.title} - Role Details`,
      content: `Hi ${candidate.name},\n\nGreat to hear back from you! I'd be happy to share more details about the ${job.title} role.\n\nThe team is focused on ${job.description.substring(0, 100)}...\n\nKey responsibilities include:\n- ${job.responsibilities[0]}\n- ${job.responsibilities[1]}\n\nWe're looking for someone with:\n- ${job.requirements[0]}\n- ${job.requirements[1]}\n\nOur salary range is ${job.salary.currency} ${job.salary.min} - ${job.salary.max} annually, with benefits including ${job.benefits.slice(0, 2).join(', ')}.\n\nWould you be interested in applying formally? I'd be happy to submit your profile directly to the hiring manager.\n\nLooking forward to your response,\n${job.recruiter}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.email
    });
  }
  
  return messages;
};

// Function to generate application communication
const generateApplicationCommunication = (candidate, job, previousMessages) => {
  const messages = [...previousMessages];
  let lastMessage = messages[messages.length - 1];
  let currentDate = new Date(lastMessage.date);
  
  // Candidate applies
  currentDate = addDays(currentDate, 1);
  messages.push({
    id: `${candidate.id}-apply-1`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Formal Application: ${job.title}`,
    content: `Hi ${job.recruiter},\n\nThank you for sharing the details. I'm very interested in the position and have attached my resume for formal consideration.\n\nI look forward to the next steps in the process.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter,
    attachments: [{
      name: 'Resume.pdf',
      size: '350 KB'
    }]
  });
  
  // Application confirmation
  messages.push({
    id: `${candidate.id}-apply-2`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Application Received: ${job.title}`,
    content: `Dear ${candidate.name},\n\nThank you for applying for the ${job.title} position at ${job.company}. We've received your application and our team will review it shortly.\n\nWe appreciate your interest in joining our team and will be in touch about next steps.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  return messages;
};

// Function to generate shortlist communication
const generateShortlistCommunication = (candidate, job, previousMessages) => {
  const messages = [...previousMessages];
  let lastMessage = messages[messages.length - 1];
  let currentDate = new Date(lastMessage.date);
  
  // Shortlist notification
  currentDate = addDays(currentDate, 3);
  messages.push({
    id: `${candidate.id}-shortlist-1`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Next Steps: ${job.title} Application`,
    content: `Hi ${candidate.name},\n\nI'm pleased to inform you that our team has reviewed your application for the ${job.title} position, and we'd like to move forward with the next steps.\n\nWe'd like to invite you to complete a technical assessment that will help us better understand your skills and approach.\n\nThe assessment should take approximately 90 minutes to complete and will be focused on ${job.skills.slice(0, 3).join(', ')}.\n\nPlease complete the assessment within the next 48 hours using the link below.\n\n[Assessment Link]\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  // Candidate acknowledges
  currentDate = addDays(currentDate, 1);
  messages.push({
    id: `${candidate.id}-shortlist-2`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Re: Next Steps: ${job.title} Application`,
    content: `Hi ${job.recruiter},\n\nThank you for the update. I'll complete the assessment within the timeframe.\n\nLooking forward to demonstrating my skills.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter
  });
  
  // Assessment completion
  currentDate = addDays(currentDate, 1);
  messages.push({
    id: `${candidate.id}-shortlist-3`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'assessment',
    channel: 'Assessment Platform',
    subject: 'Technical Assessment Completed',
    content: `${candidate.name} has completed the technical assessment with a score of ${candidate.assessment?.score || 85}%.`,
    direction: 'system',
    status: 'completed',
    metadata: {
      score: candidate.assessment?.score || 85,
      duration: '87 minutes',
      completedSections: ['Technical Knowledge', 'Problem Solving', 'Code Quality']
    }
  });
  
  return messages;
};

// Function to generate interview communication
const generateInterviewCommunication = (candidate, job, previousMessages) => {
  const messages = [...previousMessages];
  let lastMessage = messages[messages.length - 1];
  let currentDate = new Date(lastMessage.date);
  
  // Schedule interview
  currentDate = addDays(currentDate, 2);
  const interviewDate = addDays(currentDate, 5);
  messages.push({
    id: `${candidate.id}-interview-1`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Interview Invitation: ${job.title}`,
    content: `Hi ${candidate.name},\n\nBased on your strong performance on the technical assessment, we'd like to invite you for a technical interview.\n\nProposed date: ${formatDate(interviewDate)} at 10:00 AM IST\nFormat: Virtual interview via Zoom\nDuration: 60 minutes\n\nYou will be meeting with ${job.hiringManager} (Hiring Manager) and a senior team member.\n\nPlease let me know if this timing works for you.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  // Candidate confirms
  currentDate = addDays(currentDate, 1);
  messages.push({
    id: `${candidate.id}-interview-2`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Re: Interview Invitation: ${job.title}`,
    content: `Hi ${job.recruiter},\n\nThank you for the interview invitation. I confirm my availability on ${formatDate(interviewDate)} at 10:00 AM IST.\n\nI'm looking forward to discussing the role in more detail and meeting the team.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter
  });
  
  // Calendar invite
  messages.push({
    id: `${candidate.id}-interview-3`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'calendar',
    channel: 'Google Calendar',
    subject: `Technical Interview - ${candidate.name} for ${job.title}`,
    content: `Technical interview with ${job.hiringManager} (Hiring Manager) and team.\n\nMeeting Link: https://zoom.us/j/123456789\nPhone: +1 123-456-7890\nMeeting ID: 123 456 789`,
    direction: 'outbound',
    status: 'scheduled',
    sender: job.recruiter,
    recipient: candidate.email,
    metadata: {
      meetLink: 'https://zoom.us/j/123456789',
      duration: '60 minutes',
      attendees: [candidate.email, job.hiringManager, 'Senior Team Member']
    }
  });
  
  // Interview preparation
  currentDate = addDays(currentDate, 1);
  messages.push({
    id: `${candidate.id}-interview-4`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Interview Preparation: ${job.title}`,
    content: `Hi ${candidate.name},\n\nAs you prepare for your upcoming interview, I wanted to share some additional information that might be helpful:\n\n- The interview will focus on your experience with ${job.skills.slice(0, 3).join(', ')}\n- You may be asked to discuss previous projects and problem-solving approaches\n- Please prepare questions you have about the role and team\n\nIf you need anything else before the interview, please don't hesitate to reach out.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  // Interview completed
  currentDate = new Date(formatDate(interviewDate));
  messages.push({
    id: `${candidate.id}-interview-5`,
    date: formatDate(currentDate),
    time: '11:15',
    type: 'interview',
    channel: 'Zoom',
    subject: 'Technical Interview Completed',
    content: 'Technical interview conducted. Candidate demonstrated strong technical skills and cultural fit.',
    direction: 'system',
    status: 'completed',
    metadata: {
      duration: '75 minutes',
      interviewer: job.hiringManager,
      overallScore: candidate.interview?.aiAssessment?.overallScore || 88
    }
  });
  
  // Thank you email from candidate
  currentDate = addDays(currentDate, 1);
  messages.push({
    id: `${candidate.id}-interview-6`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Thank You - ${job.title} Interview`,
    content: `Dear ${job.hiringManager},\n\nThank you for taking the time to interview me for the ${job.title} position yesterday. I enjoyed our conversation about ${job.skills[0]} and learning more about the challenges your team is working on.\n\nThe role sounds like an excellent match for my skills and interests, and I'm excited about the possibility of joining your team.\n\nI look forward to hearing from you about the next steps.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.hiringManager
  });
  
  // Post-interview update
  currentDate = addDays(currentDate, 2);
  messages.push({
    id: `${candidate.id}-interview-7`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Interview Follow-up: ${job.title}`,
    content: `Hi ${candidate.name},\n\nThank you for participating in the interview. The team was impressed with your background and skills.\n\nWe're currently finalizing our decision and should have an update for you within the next week.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  return messages;
};

// Function to generate offer communication
const generateOfferCommunication = (candidate, job, previousMessages) => {
  const messages = [...previousMessages];
  let lastMessage = messages[messages.length - 1];
  let currentDate = new Date(lastMessage.date);
  
  // Offer extended
  currentDate = addDays(currentDate, 3);
  messages.push({
    id: `${candidate.id}-offer-1`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Offer Letter: ${job.title} at ${job.company}`,
    content: `Dear ${candidate.name},\n\nI'm delighted to inform you that we would like to offer you the position of ${job.title} at ${job.company}.\n\nPlease find attached the formal offer letter with all the details including:\n\n- Annual salary: ${job.salary.currency} ${job.salary.max}\n- Start date: ${formatDate(addDays(currentDate, 30))}\n- Benefits: ${job.benefits.join(', ')}\n\nWe're excited about the possibility of you joining our team and believe your skills and experience will be a valuable addition.\n\nPlease review the offer and let us know your decision within the next 5 business days.\n\nIf you have any questions or would like to discuss any aspect of the offer, please don't hesitate to reach out.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    attachments: [{
      name: `${candidate.name.replace(' ', '_')}_Offer_Letter.pdf`,
      size: '425 KB'
    }]
  });
  
  // Candidate response based on final stage
  currentDate = addDays(currentDate, 2);
  
  if (candidate.stage === RecruitmentStage.OFFER_REJECTED) {
    messages.push({
      id: `${candidate.id}-offer-2`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Re: Offer Letter: ${job.title} at ${job.company}`,
      content: `Dear ${job.recruiter},\n\nThank you very much for the offer for the position of ${job.title} at ${job.company}.\n\nAfter careful consideration, I have decided to decline the offer as I have accepted another opportunity that better aligns with my current career goals.\n\nI want to express my sincere appreciation for the time you and your team invested in me throughout the interview process. It was a pleasure learning about ${job.company} and the excellent work your team is doing.\n\nThank you again for your consideration, and I wish you and the team all the best.\n\nSincerely,\n${candidate.name}`,
      direction: 'inbound',
      status: 'read',
      sender: candidate.email,
      recipient: job.recruiter
    });
    
    // Recruiter acknowledgment
    currentDate = addDays(currentDate, 1);
    messages.push({
      id: `${candidate.id}-offer-3`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Re: Offer Letter: ${job.title} at ${job.company}`,
      content: `Dear ${candidate.name},\n\nThank you for letting us know about your decision. While we're disappointed that you won't be joining our team, we understand that you need to make the best decision for your career.\n\nWe appreciate your consideration and the time you spent with us during the interview process. The door remains open should your circumstances change in the future.\n\nWe wish you all the best in your new role and future endeavors.\n\nBest regards,\n${job.recruiter}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.email
    });
  } else if (candidate.stage === RecruitmentStage.HIRED) {
    messages.push({
      id: `${candidate.id}-offer-2`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Re: Offer Letter: ${job.title} at ${job.company}`,
      content: `Dear ${job.recruiter},\n\nI am thrilled to accept the offer for the position of ${job.title} at ${job.company}.\n\nI've attached the signed offer letter and am excited to join the team on ${formatDate(addDays(currentDate, 30))}.\n\nThank you for the opportunity, and I look forward to contributing to the success of ${job.company}.\n\nBest regards,\n${candidate.name}`,
      direction: 'inbound',
      status: 'read',
      sender: candidate.email,
      recipient: job.recruiter,
      attachments: [{
        name: `${candidate.name.replace(' ', '_')}_Signed_Offer.pdf`,
        size: '430 KB'
      }]
    });
    
    // Welcome email
    currentDate = addDays(currentDate, 1);
    messages.push({
      id: `${candidate.id}-offer-3`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Welcome to ${job.company}!`,
      content: `Dear ${candidate.name},\n\nWe're delighted that you've accepted our offer! The entire team is looking forward to having you onboard.\n\nIn the coming weeks, you'll receive several emails with information about:\n\n- Onboarding documentation\n- Background check process\n- Equipment selection\n- First day logistics\n\nIn the meantime, if you have any questions, please don't hesitate to contact me.\n\nWelcome to the team!\n\nBest regards,\n${job.recruiter}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.email
    });
    
    // Onboarding details
    currentDate = addDays(currentDate, 7);
    messages.push({
      id: `${candidate.id}-offer-4`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Onboarding Information: ${job.company}`,
      content: `Dear ${candidate.name},\n\nAs we prepare for your start date on ${formatDate(addDays(currentDate, 21))}, we'd like to share some important onboarding information.\n\nPlease complete the following before your start date:\n\n1. Employee information form (attached)\n2. Tax documentation\n3. Direct deposit setup\n\nYour first day will begin at 9:30 AM, and you'll be meeting with various team members throughout the day.\n\nWe're excited to have you join us!\n\nBest regards,\n${job.recruiter}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.email,
      attachments: [{
        name: 'Onboarding_Documents.pdf',
        size: '1.2 MB'
      }]
    });
  }
  
  return messages;
};

// Main function to generate communication history
const generateEnhancedCommunication = (candidate) => {
  const relevantJob = jobs.find(job => job.id === candidate.jobId);
  if (!relevantJob) return [];
  
  let messages = [];
  
  // Step 1: Generate outreach communication
  messages = generateOutreachMessage(candidate, relevantJob);
  
  // Step 2: Add application communication if beyond outreach
  if (candidate.stage !== RecruitmentStage.OUTREACHED) {
    messages = generateApplicationCommunication(candidate, relevantJob, messages);
  }
  
  // Step 3: Add shortlist communication if beyond applied
  if (![RecruitmentStage.OUTREACHED, RecruitmentStage.APPLIED].includes(candidate.stage)) {
    messages = generateShortlistCommunication(candidate, relevantJob, messages);
  }
  
  // Step 4: Add interview communication if beyond shortlisted
  if (![RecruitmentStage.OUTREACHED, RecruitmentStage.APPLIED, RecruitmentStage.SHORTLISTED].includes(candidate.stage)) {
    messages = generateInterviewCommunication(candidate, relevantJob, messages);
  }
  
  // Step 5: Add offer communication if in final stages
  if ([RecruitmentStage.OFFER_EXTENDED, RecruitmentStage.OFFER_REJECTED, RecruitmentStage.HIRED].includes(candidate.stage)) {
    messages = generateOfferCommunication(candidate, relevantJob, messages);
  }
  
  return messages;
};

// Generate communication for 5 candidates
const selectedCandidates = candidates.slice(0, 5);
const enrichedCommunication = {};

selectedCandidates.forEach(candidate => {
  enrichedCommunication[candidate.id] = generateEnhancedCommunication(candidate);
});

// Output the results
console.log("Generated enhanced communication for candidates:");
selectedCandidates.forEach(candidate => {
  console.log(`${candidate.name} (${candidate.stage}): ${enrichedCommunication[candidate.id].length} communication events`);
});

// Save to a JSON file
const outputFile = path.join(__dirname, 'enrichedCommunication.json');
fs.writeFileSync(outputFile, JSON.stringify(enrichedCommunication, null, 2));
console.log(`\nResults saved to ${outputFile}`); 