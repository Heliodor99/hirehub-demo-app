const { RecruitmentStage, CommunicationEvent, Candidate, Job } = require('../src/types');
const { generateCommunicationTimeline } = require('../src/utils/communication');
const fs = require('fs');
const path = require('path');

const jobsFilePath = path.join(__dirname, '../src/data/jobs.ts');

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

const generateOutreachMessage = (job: typeof Job, candidate: typeof Candidate): string => {
  return `Hi ${candidate.name},

I hope this message finds you well! I'm reaching out from ${job.company} regarding our ${job.title} position. Your background in ${candidate.skills.slice(0, 2).join(' and ')} caught our attention, and we believe you could be a great fit for our team.

The role involves ${job.description.split('.')[0]}. Given your experience at ${candidate.currentCompany}, I'd love to discuss this opportunity with you.

Would you be interested in learning more about this position?

Best regards,
${job.recruiter}
${job.company}`;
};

const generateApplicationMessage = (job: typeof Job, candidate: typeof Candidate): string => {
  return `Thank you for your interest in the ${job.title} position at ${job.company}. 

I'm excited about your application and your experience with ${candidate.skills.slice(0, 3).join(', ')}. We'll review your application and get back to you soon.

Best regards,
${job.recruiter}`;
};

const generateShortlistMessage = (job: typeof Job, candidate: typeof Candidate): string => {
  return `Dear ${candidate.name},

Great news! After reviewing your application for the ${job.title} position, we're impressed with your profile and would like to move forward with the interview process.

The next step would be a technical assessment followed by an interview with our team. Could you please let us know your availability for the coming week?

Best regards,
${job.recruiter}`;
};

const generateInterviewSchedule = (job: typeof Job, candidate: typeof Candidate, interviewDate: Date): string => {
  return `Dear ${candidate.name},

Your interview for the ${job.title} position has been scheduled for:

Date: ${formatDate(interviewDate)}
Time: ${getRandomTime()}
Location: Virtual (Zoom)

Interviewers:
- ${job.hiringManager} (Hiring Manager)
- ${job.recruiter} (Recruiter)

Please confirm if this works for you.

Best regards,
${job.recruiter}`;
};

const generateOfferMessage = (job: typeof Job, candidate: typeof Candidate): string => {
  return `Dear ${candidate.name},

I'm delighted to inform you that we would like to extend an offer for the position of ${job.title} at ${job.company}.

We were particularly impressed with your ${candidate.skills.slice(0, 2).join(' and ')} skills and believe you'll be a valuable addition to our team.

We'll send the formal offer letter shortly with all the details. Looking forward to your positive response.

Best regards,
${job.hiringManager}
${job.company}`;
};

const generateCommunicationHistory = (candidate: typeof Candidate, job: typeof Job): typeof CommunicationEvent[] => {
  const communications: typeof CommunicationEvent[] = [];
  const startDate = new Date(candidate.appliedDate);
  startDate.setDate(startDate.getDate() - 5); // Set outreach date 5 days before application
  let currentDate = startDate;

  // Initial outreach
  communications.push({
    id: `${candidate.id}-1`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Opportunity: ${job.title} at ${job.company}`,
    content: generateOutreachMessage(job, candidate),
    direction: 'outbound',
    status: 'delivered',
    sender: job.recruiter,
    recipient: candidate.email
  });

  // Candidate response (1 day later)
  currentDate = addDays(currentDate, 1);
  communications.push({
    id: `${candidate.id}-2`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Re: Opportunity: ${job.title} at ${job.company}`,
    content: 'Thank you for reaching out! Yes, I would be interested in learning more about this opportunity.',
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter
  });

  // Application received (3 days later)
  currentDate = addDays(currentDate, 3);
  communications.push({
    id: `${candidate.id}-3`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'system',
    channel: 'ATS',
    subject: 'Application Submitted',
    content: `Application received for ${job.title}`,
    direction: 'system',
    status: 'completed',
    metadata: {
      applicationId: `APP-${candidate.id}`,
      source: candidate.source
    }
  });

  // Application acknowledgment
  communications.push({
    id: `${candidate.id}-4`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `Application Received - ${job.title}`,
    content: generateApplicationMessage(job, candidate),
    direction: 'outbound',
    status: 'delivered',
    sender: job.recruiter,
    recipient: candidate.email
  });

  if ([
    RecruitmentStage.SHORTLISTED,
    RecruitmentStage.INTERVIEWED,
    RecruitmentStage.OFFER_EXTENDED,
    RecruitmentStage.OFFER_REJECTED,
    RecruitmentStage.HIRED
  ].includes(candidate.stage)) {
    // Shortlist notification (2 days later)
    currentDate = addDays(currentDate, 2);
    communications.push({
      id: `${candidate.id}-5`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Next Steps - ${job.title} Position`,
      content: generateShortlistMessage(job, candidate),
      direction: 'outbound',
      status: 'delivered',
      sender: job.recruiter,
      recipient: candidate.email
    });

    // Candidate availability response
    currentDate = addDays(currentDate, 1);
    communications.push({
      id: `${candidate.id}-6`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'whatsapp',
      channel: 'WhatsApp',
      subject: 'Interview Availability',
      content: `I'm available next week on Tuesday and Wednesday between 10 AM and 4 PM.`,
      direction: 'inbound',
      status: 'read',
      sender: candidate.phone,
      recipient: job.recruiter
    });
  }

  if ([
    RecruitmentStage.INTERVIEWED,
    RecruitmentStage.OFFER_EXTENDED,
    RecruitmentStage.OFFER_REJECTED,
    RecruitmentStage.HIRED
  ].includes(candidate.stage)) {
    // Interview schedule
    currentDate = addDays(currentDate, 2);
    const interviewDate = addDays(currentDate, 3);
    communications.push({
      id: `${candidate.id}-7`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'calendar',
      channel: 'Email',
      subject: `Interview Schedule - ${job.title}`,
      content: generateInterviewSchedule(job, candidate, interviewDate),
      direction: 'outbound',
      status: 'scheduled',
      sender: job.recruiter,
      recipient: candidate.email,
      metadata: {
        eventType: 'interview',
        zoomLink: 'https://zoom.us/j/123456789'
      }
    });

    // Interview confirmation
    currentDate = addDays(currentDate, 1);
    communications.push({
      id: `${candidate.id}-8`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'whatsapp',
      channel: 'WhatsApp',
      subject: 'Interview Confirmation',
      content: 'Thank you for the schedule. I confirm my availability for the interview.',
      direction: 'inbound',
      status: 'read',
      sender: candidate.phone,
      recipient: job.recruiter
    });

    // Interview reminder
    currentDate = addDays(currentDate, 2);
    communications.push({
      id: `${candidate.id}-9`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'system',
      channel: 'Email',
      subject: 'Interview Reminder',
      content: `Reminder: Interview tomorrow for ${job.title}`,
      direction: 'outbound',
      status: 'delivered',
      sender: 'system',
      recipient: candidate.email
    });

    // Interview completed
    currentDate = addDays(currentDate, 1);
    communications.push({
      id: `${candidate.id}-10`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'assessment',
      channel: 'ATS',
      subject: 'Interview Completed',
      content: 'Technical interview completed',
      direction: 'system',
      status: 'completed',
      metadata: {
        interviewType: 'technical',
        duration: '45 minutes',
        overallScore: candidate.assessment?.score
      }
    });
  }

  if ([
    RecruitmentStage.OFFER_EXTENDED,
    RecruitmentStage.OFFER_REJECTED,
    RecruitmentStage.HIRED
  ].includes(candidate.stage)) {
    // Offer extension
    currentDate = addDays(currentDate, 2);
    communications.push({
      id: `${candidate.id}-11`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: `Offer Letter - ${job.title} at ${job.company}`,
      content: generateOfferMessage(job, candidate),
      direction: 'outbound',
      status: 'delivered',
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
      communications.push({
        id: `${candidate.id}-12`,
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
      communications.push({
        id: `${candidate.id}-12`,
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

  return communications;
};

const updateCandidatesWithCommunication = () => {
  // Read the jobs.ts file
  const filePath = path.join(process.cwd(), 'src', 'data', 'jobs.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  try {
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
        communicationTimeline: generateCommunicationHistory(candidate, job)
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