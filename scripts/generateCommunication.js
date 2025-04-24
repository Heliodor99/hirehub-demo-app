// Script to enrich candidates with communication histories
const fs = require('fs');
const path = require('path');

// Define the RecruitmentStage enum to match what's in the codebase
const RecruitmentStage = {
  OUTREACHED: "Outreached",
  APPLIED: "Applied",
  SHORTLISTED: "Shortlisted",
  INTERVIEWED: "Interviewed",
  REJECTED: "Rejected",
  OFFER_EXTENDED: "Offer Extended",
  OFFER_REJECTED: "Offer Rejected",
  HIRED: "Hired"
};

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

// Function to read and parse TS file content for candidates
const readCandidates = () => {
  const candidatesPath = path.join(__dirname, '../src/data/candidates.ts');
  try {
    const content = fs.readFileSync(candidatesPath, 'utf8');
    // Simple parsing to extract candidate objects - not a proper TS parser, but works for demo
    const candidates = [];
    let inCandidate = false;
    let bracketCount = 0;
    let currentCandidate = '';
    
    // Split the content by lines
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Look for the start of a candidate object
      if (line.includes('{') && (line.includes('id:') || inCandidate)) {
        inCandidate = true;
        bracketCount += (line.match(/{/g) || []).length;
        bracketCount -= (line.match(/}/g) || []).length;
        currentCandidate += line + '\n';
        
        // If we've found the end of a candidate object
        if (bracketCount === 0 && inCandidate) {
          try {
            // Convert to a JavaScript object
            const candidateStr = currentCandidate.replace(/'/g, '"')
              .replace(/(\w+):/g, '"$1":')  // Convert property names to strings
              .replace(/(\d+),\s*(\}|\])/g, '$1$2'); // Fix trailing commas
            
            // Eval is generally dangerous, but in this controlled script it's ok for demo
            const candidateObj = eval('(' + candidateStr + ')');
            candidates.push(candidateObj);
          } catch (e) {
            console.log('Error parsing candidate:', e);
          }
          
          inCandidate = false;
          currentCandidate = '';
        }
      } else if (inCandidate) {
        bracketCount += (line.match(/{/g) || []).length;
        bracketCount -= (line.match(/}/g) || []).length;
        currentCandidate += line + '\n';
      }
    }
    
    return candidates;
  } catch (error) {
    console.error('Error reading candidates file:', error);
    return [];
  }
};

// Function to read and parse TS file content for jobs
const readJobs = () => {
  const jobsPath = path.join(__dirname, '../src/data/jobs.ts');
  try {
    const content = fs.readFileSync(jobsPath, 'utf8');
    // Create some sample job data since proper parsing is complex
    return [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp India',
        description: 'We are looking for an experienced Frontend Developer',
        recruiter: 'Priya Patel',
        hiringManager: 'Rajesh Sharma',
        salary: { currency: 'INR', min: 1800000, max: 2800000 }
      },
      {
        id: '2',
        title: 'Product Manager',
        company: 'InnovateTech Solutions',
        description: 'Join our product team to drive innovation',
        recruiter: 'Anjali Singh',
        hiringManager: 'Vikram Mehta',
        salary: { currency: 'INR', min: 1600000, max: 2500000 }
      },
      {
        id: '3',
        title: 'Data Scientist',
        company: 'DataInsights India',
        description: 'Looking for a Data Scientist to help us extract insights',
        recruiter: 'Neha Gupta',
        hiringManager: 'Aditya Verma',
        salary: { currency: 'INR', min: 1900000, max: 2700000 }
      },
      {
        id: '4',
        title: 'DevOps Engineer',
        company: 'CloudSystems India',
        description: 'Seeking an experienced DevOps Engineer',
        recruiter: 'Divya Malhotra',
        hiringManager: 'Sameer Joshi',
        salary: { currency: 'INR', min: 1700000, max: 2600000 }
      },
      {
        id: '5',
        title: 'UX Designer',
        company: 'DesignHub',
        description: 'Looking for a creative UX Designer',
        recruiter: 'Rahul Verma',
        hiringManager: 'Nisha Patel',
        salary: { currency: 'INR', min: 1500000, max: 2400000 }
      }
    ];
  } catch (error) {
    console.error('Error reading jobs file:', error);
    return [];
  }
};

// Generate communication for a candidate based on their current stage
const generateCommunicationHistory = (candidate, job) => {
  const communications = [];
  
  // Define start date from candidate's applied date or a default date
  const startDate = candidate.appliedDate ? new Date(candidate.appliedDate) : new Date();
  startDate.setMonth(startDate.getMonth() - 1); // Start outreach 1 month before application
  let currentDate = new Date(startDate);
  
  // 1. Outreach phase
  const platforms = ['LinkedIn', 'Email', 'WhatsApp'];
  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  const platformIcon = platform === 'LinkedIn' ? '💼' : platform === 'Email' ? '📧' : '📱';
  
  communications.push({
    id: `${candidate.id}-out-1`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: platform.toLowerCase(),
    channel: platform,
    subject: `${platformIcon} Opportunity: ${job.title} at ${job.company}`,
    content: `Hi ${candidate.name},\n\nI'm ${job.recruiter} from ${job.company}. We're looking for a ${job.title} and your profile caught my attention. Based on your experience at ${candidate.currentCompany}, I think you'd be a great fit for our team.\n\nWould you be interested in learning more about this opportunity?\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  // If candidate is only at outreach stage, stop here
  if (candidate.stage === RecruitmentStage.OUTREACHED) {
    return communications;
  }
  
  // Candidate response to outreach
  currentDate = addDays(currentDate, 1);
  communications.push({
    id: `${candidate.id}-out-2`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: platform.toLowerCase(),
    channel: platform,
    subject: `${platformIcon} Re: Opportunity: ${job.title} at ${job.company}`,
    content: `Hi ${job.recruiter},\n\nThank you for reaching out. I'm definitely interested in learning more about the ${job.title} position at ${job.company}.\n\nI'm currently looking for new opportunities that match my skills in relevant areas.\n\nCould you share more details about the role?\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter
  });
  
  // 2. Application phase
  currentDate = addDays(currentDate, 2);
  communications.push({
    id: `${candidate.id}-app-1`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `📧 ${job.title} Position - Application Submitted`,
    content: `Dear ${job.recruiter},\n\nAfter our conversation, I'm excited to formally apply for the ${job.title} position at ${job.company}.\n\nI've attached my resume and a cover letter detailing my relevant experience.\n\nThank you for considering my application. I look forward to discussing how I can contribute to your team.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter,
    attachments: [{
      name: 'Resume.pdf',
      size: '350 KB'
    }, {
      name: 'Cover_Letter.pdf',
      size: '210 KB'
    }]
  });
  
  // Application confirmation
  currentDate = addDays(currentDate, 1);
  communications.push({
    id: `${candidate.id}-app-2`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `📧 Application Received: ${job.title}`,
    content: `Dear ${candidate.name},\n\nThank you for applying for the ${job.title} position at ${job.company}.\n\nWe have received your application and our team will review it shortly. We appreciate your interest in joining our team.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  // If candidate is only at applied stage, stop here
  if (candidate.stage === RecruitmentStage.APPLIED) {
    return communications;
  }
  
  // 3. Shortlisting phase
  currentDate = addDays(currentDate, 3);
  communications.push({
    id: `${candidate.id}-short-1`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `📧 Shortlisted for ${job.title} Position`,
    content: `Dear ${candidate.name},\n\nI'm pleased to inform you that after reviewing your application, our team would like to move forward with your candidacy for the ${job.title} position.\n\nAs the next step, we'd like to invite you to complete a technical assessment to better understand your skills.\n\nThe assessment will focus on relevant technical areas and should take approximately 90 minutes to complete.\n\nPlease use the link below to access the assessment, which should be completed within the next 3 days.\n\n[Assessment Link]\n\nIf you have any questions, please don't hesitate to contact me.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  // Candidate acknowledges
  currentDate = addDays(currentDate, 1);
  communications.push({
    id: `${candidate.id}-short-2`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `📧 Re: Shortlisted for ${job.title} Position`,
    content: `Hi ${job.recruiter},\n\nThank you for the update. I'm excited to move forward in the process.\n\nI'll complete the technical assessment within the timeframe provided.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter
  });
  
  // Assessment completion
  currentDate = addDays(currentDate, 2);
  communications.push({
    id: `${candidate.id}-short-3`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'assessment',
    channel: 'Assessment Platform',
    subject: '📊 Technical Assessment Completed',
    content: `${candidate.name} has completed the technical assessment for the ${job.title} position.\n\nScore: ${candidate.assessment?.score || 85}%\nCompletion Time: 82 minutes`,
    direction: 'system',
    status: 'completed',
    metadata: {
      score: candidate.assessment?.score || 85,
      duration: '82 minutes',
      completedSections: ['Technical Knowledge', 'Problem Solving', 'Coding Challenge']
    }
  });
  
  // If candidate is only at shortlisted stage, stop here
  if (candidate.stage === RecruitmentStage.SHORTLISTED) {
    return communications;
  }
  
  // 4. Interview phase
  currentDate = addDays(currentDate, 2);
  const interviewDate = addDays(currentDate, 5);
  communications.push({
    id: `${candidate.id}-int-1`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `📧 Interview Invitation for ${job.title} Position`,
    content: `Dear ${candidate.name},\n\nBased on your strong performance on the technical assessment, we'd like to invite you for an interview for the ${job.title} position.\n\nInterview Details:\nDate: ${formatDate(interviewDate)}\nTime: 10:00 AM IST\nFormat: Virtual via Zoom\nExpected Duration: 60 minutes\n\nYou'll be meeting with ${job.hiringManager} (Hiring Manager) and one of our senior team members.\n\nPlease confirm if this time works for you. If not, please suggest a few alternative times that would be suitable.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email
  });
  
  // Interview confirmation
  currentDate = addDays(currentDate, 1);
  communications.push({
    id: `${candidate.id}-int-2`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `📧 Re: Interview Invitation for ${job.title} Position`,
    content: `Hi ${job.recruiter},\n\nThank you for the interview invitation. I'm pleased to confirm my availability on ${formatDate(interviewDate)} at 10:00 AM IST.\n\nI'm looking forward to discussing the role in more detail and meeting the team.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.recruiter
  });
  
  // Calendar invite
  communications.push({
    id: `${candidate.id}-int-3`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'calendar',
    channel: 'Google Calendar',
    subject: `📅 Interview: ${candidate.name} - ${job.title}`,
    content: `Technical Interview with ${job.hiringManager}\n\nTime: ${formatDate(interviewDate)} 10:00 AM - 11:00 AM IST\nLocation: Zoom (link below)\n\nZoom Meeting ID: 123 456 789\nPasscode: 654321\nLink: https://zoom.us/j/123456789`,
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
  
  // Interview completed
  currentDate = new Date(interviewDate);
  communications.push({
    id: `${candidate.id}-int-4`,
    date: formatDate(currentDate),
    time: '11:10',
    type: 'interview',
    channel: 'Zoom',
    subject: '🎥 Technical Interview Completed',
    content: 'Technical interview conducted with detailed evaluation. Candidate demonstrated strong problem-solving skills and relevant experience.',
    direction: 'system',
    status: 'completed',
    metadata: {
      duration: '70 minutes',
      interviewer: job.hiringManager,
      overallScore: candidate.interview?.aiAssessment?.overallScore || 88
    }
  });
  
  // Thank you email from candidate
  currentDate = addDays(currentDate, 1);
  communications.push({
    id: `${candidate.id}-int-5`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `📧 Thank You - ${job.title} Interview`,
    content: `Dear ${job.hiringManager},\n\nThank you for taking the time to interview me yesterday for the ${job.title} position. I enjoyed our conversation and learning more about the role and the company.\n\nThe projects you mentioned align well with my experience, and I'm excited about the possibility of contributing to your team.\n\nI look forward to hearing about the next steps in the process.\n\nBest regards,\n${candidate.name}`,
    direction: 'inbound',
    status: 'read',
    sender: candidate.email,
    recipient: job.hiringManager
  });
  
  // If candidate is only at interviewed stage, stop here
  if (candidate.stage === RecruitmentStage.INTERVIEWED) {
    return communications;
  }
  
  // 5. Offer phase
  currentDate = addDays(currentDate, 3);
  communications.push({
    id: `${candidate.id}-offer-1`,
    date: formatDate(currentDate),
    time: getRandomTime(),
    type: 'email',
    channel: 'Email',
    subject: `📧 Offer Letter: ${job.title} at ${job.company}`,
    content: `Dear ${candidate.name},\n\nI am delighted to inform you that we would like to offer you the position of ${job.title} at ${job.company}.\n\nPlease find attached the formal offer letter with all the details, including:\n- Annual salary: ${job.salary?.currency || 'INR'} ${job.salary?.max || '2500000'}\n- Start date: ${formatDate(addDays(currentDate, 30))}\n- Benefits package\n\nWe're excited about the possibility of you joining our team and look forward to your response within the next 5 business days.\n\nIf you have any questions or would like to discuss any aspect of the offer, please don't hesitate to reach out.\n\nBest regards,\n${job.recruiter}`,
    direction: 'outbound',
    status: 'sent',
    sender: job.recruiter,
    recipient: candidate.email,
    attachments: [{
      name: 'Offer_Letter.pdf',
      size: '425 KB'
    }]
  });
  
  // 6. Final decision phase
  currentDate = addDays(currentDate, 3);
  
  if (candidate.stage === RecruitmentStage.OFFER_REJECTED) {
    communications.push({
      id: `${candidate.id}-decline-1`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: `📧 Re: Offer Letter: ${job.title} at ${job.company}`,
      content: `Dear ${job.recruiter},\n\nThank you for the offer for the ${job.title} position at ${job.company}.\n\nAfter careful consideration, I've decided to decline the offer as I've accepted another position that better aligns with my current career goals.\n\nI sincerely appreciate the time you and your team invested throughout the interview process. It was a pleasure learning about ${job.company} and the exciting work you're doing.\n\nThank you again for your consideration, and I wish you and the team continued success.\n\nBest regards,\n${candidate.name}`,
      direction: 'inbound',
      status: 'read',
      sender: candidate.email,
      recipient: job.recruiter
    });
    
    // Acknowledgment email
    currentDate = addDays(currentDate, 1);
    communications.push({
      id: `${candidate.id}-decline-2`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: `📧 Re: Offer Letter: ${job.title} at ${job.company}`,
      content: `Dear ${candidate.name},\n\nThank you for letting us know about your decision. While we're disappointed that you won't be joining our team, we understand that you need to make the best decision for your career.\n\nWe appreciate your consideration and the time you spent with us during the interview process. Should your circumstances change in the future, please don't hesitate to reach out.\n\nWe wish you all the best in your new role.\n\nBest regards,\n${job.recruiter}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.email
    });
  } else if (candidate.stage === RecruitmentStage.HIRED) {
    communications.push({
      id: `${candidate.id}-accept-1`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: `📧 Re: Offer Letter: ${job.title} at ${job.company}`,
      content: `Dear ${job.recruiter},\n\nI am thrilled to accept the offer for the position of ${job.title} at ${job.company}.\n\nI've attached the signed offer letter. I'm excited to join the team on ${formatDate(addDays(currentDate, 30))} and contribute to the success of ${job.company}.\n\nThank you for the opportunity, and I look forward to meeting everyone soon.\n\nBest regards,\n${candidate.name}`,
      direction: 'inbound',
      status: 'read',
      sender: candidate.email,
      recipient: job.recruiter,
      attachments: [{
        name: 'Signed_Offer_Letter.pdf',
        size: '430 KB'
      }]
    });
    
    // Welcome email
    currentDate = addDays(currentDate, 1);
    communications.push({
      id: `${candidate.id}-accept-2`,
      date: formatDate(currentDate),
      time: getRandomTime(),
      type: 'email',
      channel: 'Email',
      subject: `📧 Welcome to ${job.company}!`,
      content: `Dear ${candidate.name},\n\nWe're delighted that you've accepted our offer! The entire team is looking forward to having you onboard.\n\nYou'll be receiving several emails in the coming weeks with information about onboarding, equipment, and first-day logistics.\n\nIn the meantime, if you have any questions, please don't hesitate to reach out.\n\nWelcome to the team!\n\nBest regards,\n${job.recruiter}`,
      direction: 'outbound',
      status: 'sent',
      sender: job.recruiter,
      recipient: candidate.email
    });
  }
  
  return communications;
};

// Main script execution
try {
  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  // Read candidates and jobs from files
  const candidates = readCandidates();
  const jobs = readJobs();
  
  console.log(`Loaded ${candidates.length} candidates and ${jobs.length} jobs`);
  
  // If no candidates were found, create sample candidates
  const candidatesToProcess = candidates.length > 0 ? candidates : [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+91 9876543210',
      currentTitle: 'Senior UI/UX Designer',
      currentCompany: 'TechSolutions Inc.',
      stage: RecruitmentStage.INTERVIEWED,
      jobId: '1'
    },
    {
      id: '2',
      name: 'Raj Sharma',
      email: 'raj.sharma@example.com',
      phone: '+91 9876543211',
      currentTitle: 'Sales Manager',
      currentCompany: 'GlobalTech Solutions',
      stage: RecruitmentStage.SHORTLISTED,
      jobId: '2'
    },
    {
      id: '3',
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      phone: '+91 9876543212',
      currentTitle: 'Senior Full Stack Developer',
      currentCompany: 'TechInnovate',
      stage: RecruitmentStage.OFFER_EXTENDED,
      jobId: '3'
    },
    {
      id: '4',
      name: 'Priya Gupta',
      email: 'priya.gupta@example.com',
      phone: '+91 9876543213',
      currentTitle: 'AI Research Intern',
      currentCompany: 'AI Labs',
      stage: RecruitmentStage.REJECTED,
      jobId: '4'
    },
    {
      id: '5',
      name: 'Vikram Malhotra',
      email: 'vikram.m@example.com',
      phone: '+91 9876543214',
      currentTitle: 'Product Manager',
      currentCompany: 'TechCorp',
      stage: RecruitmentStage.OFFER_REJECTED,
      jobId: '5'
    }
  ];
  
  // Process the first 5 candidates
  const selectedCandidates = candidatesToProcess.slice(0, 5);
  const enrichedCandidates = [];
  const candidateCommunications = {};
  
  selectedCandidates.forEach(candidate => {
    const job = jobs.find(j => j.id === candidate.jobId) || jobs[0];
    const communications = generateCommunicationHistory(candidate, job);
    candidateCommunications[candidate.id] = communications;
    
    // Create an enriched candidate with the communication timeline
    const enrichedCandidate = {
      ...candidate,
      communicationTimeline: communications
    };
    enrichedCandidates.push(enrichedCandidate);
    
    console.log(`Generated ${communications.length} communication events for ${candidate.name} (${candidate.stage})`);
  });
  
  // Save the communication data as JSON
  const communicationsPath = path.join(outputDir, 'candidateCommunications.json');
  fs.writeFileSync(communicationsPath, JSON.stringify(candidateCommunications, null, 2));
  
  // Save the enriched candidates as JSON
  const enrichedPath = path.join(outputDir, 'enrichedCandidates.json');
  fs.writeFileSync(enrichedPath, JSON.stringify(enrichedCandidates, null, 2));
  
  console.log(`\nGenerated communication data for ${selectedCandidates.length} candidates`);
  console.log(`Saved communication data to ${communicationsPath}`);
  console.log(`Saved enriched candidates to ${enrichedPath}`);
  console.log('\nTo use this data in your application, you can:');
  console.log('1. Import the JSON files directly');
  console.log('2. Copy the communication events into your candidates data');
  
} catch (error) {
  console.error('Error in script execution:', error);
  console.error(error.stack);
} 