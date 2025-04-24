// This is a simple script to demonstrate how a communication timeline would look 
// for a candidate with "HireHub" as the source

const { generateCommunicationTimeline } = require('../utils/communication');

// Mock data
const mockCandidate = {
  id: 'mock-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91-12345-67890',
  currentTitle: 'Senior Software Engineer',
  currentCompany: 'TechCorp',
  location: 'Remote',
  experience: 5,
  skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
  education: [
    {
      degree: 'B.Tech in Computer Science',
      institution: 'Example University',
      year: 2018
    }
  ],
  resume: 'https://example.com/resume.pdf',
  source: 'HireHub', // This is the key part we're changing
  appliedDate: '2024-03-01',
  stage: 'Outreached', // Will test with different stages
  jobId: '1',
  notes: 'Found via HireHub outreach'
};

const mockJob = {
  id: '1',
  title: 'Full Stack Developer',
  company: 'ExampleTech',
  location: 'Bangalore, India',
  department: 'Engineering',
  description: 'We are looking for a talented Full Stack Developer...',
  requirements: ['JavaScript', 'React', 'Node.js', '3+ years of experience'],
  responsibilities: ['Develop web applications', 'Work with cross-functional teams'],
  salary: {
    min: 1500000,
    max: 2500000,
    currency: 'INR'
  },
  postedDate: '2024-01-15',
  status: 'Active',
  hiringManager: 'Jane Smith',
  recruiter: 'Alex Recruiter',
  pipeline: {
    stages: ['Outreached', 'Applied', 'Shortlisted', 'Interviewed']
  }
};

// Test different stages
const stages = [
  'Outreached',
  'Applied',
  'Shortlisted',
  'Interviewed',
  'Offer Extended'
];

// Show timeline for each stage
stages.forEach(stage => {
  console.log(`\n\n==========================================`);
  console.log(`STAGE: ${stage} (Source: HireHub)`);
  console.log(`==========================================\n`);
  
  const candidateWithStage = { 
    ...mockCandidate, 
    stage: stage 
  };
  
  try {
    const timeline = generateCommunicationTimeline(candidateWithStage, mockJob);
    
    // Count channels
    const channelCounts = timeline.reduce((acc, event) => {
      acc[event.channel] = (acc[event.channel] || 0) + 1;
      return acc;
    }, {});
    
    // Count directions
    const directionCounts = timeline.reduce((acc, event) => {
      acc[event.direction] = (acc[event.direction] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`Timeline has ${timeline.length} events`);
    console.log('Channels:', channelCounts);
    console.log('Directions:', directionCounts);
    console.log('\nTimeline summary:');
    
    timeline.forEach((event, idx) => {
      console.log(`${idx + 1}. ${event.date} - ${event.channel} - ${event.direction} - ${event.subject}`);
    });
    
    // Show details of first 2 events
    console.log('\nFirst two events details:');
    timeline.slice(0, 2).forEach((event, idx) => {
      console.log(`\nEvent ${idx + 1}:`);
      console.log(`Type: ${event.type}`);
      console.log(`Channel: ${event.channel}`);
      console.log(`Direction: ${event.direction}`);
      console.log(`Subject: ${event.subject}`);
      console.log(`Content: ${event.content.substring(0, 100)}...`);
    });
    
  } catch (error) {
    console.error(`Error generating timeline for stage ${stage}:`, error);
  }
});

// Now compare with a non-HireHub source
console.log(`\n\n==========================================`);
console.log(`COMPARISON: Outreached stage with different sources`);
console.log(`==========================================\n`);

const sources = ['HireHub', 'LinkedIn', 'Indeed'];

sources.forEach(source => {
  console.log(`\nSource: ${source}`);
  const candidateWithSource = { 
    ...mockCandidate, 
    source: source,
    stage: 'Outreached'
  };
  
  try {
    const timeline = generateCommunicationTimeline(candidateWithSource, mockJob);
    
    // Count channels
    const channelCounts = timeline.reduce((acc, event) => {
      acc[event.channel] = (acc[event.channel] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`Timeline has ${timeline.length} events`);
    console.log('Channels:', channelCounts);
    
    console.log('First event channel:', timeline[0].channel);
    console.log('First event type:', timeline[0].type);
  } catch (error) {
    console.error(`Error generating timeline for source ${source}:`, error);
  }
}); 