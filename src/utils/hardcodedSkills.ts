// Hardcoded skill sets that repeat for every 10 candidates
// Candidates with IDs 1, 11, 21, etc. will have skill set 1
// Candidates with IDs 2, 12, 22, etc. will have skill set 2, and so on

interface Skill {
  name: string;
  proficiency: number;
}

export const hardcodedSkillSets: Array<Skill[]> = [
  // Set 1 for candidates 1, 11, 21...
  [
    { name: 'React', proficiency: 8 },
    { name: 'JavaScript', proficiency: 9 },
    { name: 'TypeScript', proficiency: 7 },
    { name: 'HTML/CSS', proficiency: 8 },
    { name: 'Redux', proficiency: 7 },
    { name: 'Next.js', proficiency: 8 }
  ],
  // Set 2 for candidates 2, 12, 22...
  [
    { name: 'Python', proficiency: 8 },
    { name: 'TensorFlow', proficiency: 8 },
    { name: 'PyTorch', proficiency: 9 },
    { name: 'Data Analysis', proficiency: 9 },
    { name: 'NLP', proficiency: 8 },
    { name: 'Computer Vision', proficiency: 8 }
  ],
  // Set 3 for candidates 3, 13, 23...
  [
    { name: 'Java', proficiency: 9 },
    { name: 'Spring Boot', proficiency: 8 },
    { name: 'Microservices', proficiency: 7 },
    { name: 'Hibernate', proficiency: 8 },
    { name: 'RESTful APIs', proficiency: 9 },
    { name: 'Cloud Services', proficiency: 7 }
  ],
  // Set 4 for candidates 4, 14, 24...
  [
    { name: 'Product Strategy', proficiency: 8 },
    { name: 'User Experience', proficiency: 9 },
    { name: 'Agile Methodologies', proficiency: 8 },
    { name: 'Roadmapping', proficiency: 7 },
    { name: 'Market Analysis', proficiency: 8 },
    { name: 'Stakeholder Management', proficiency: 9 }
  ],
  // Set 5 for candidates 5, 15, 25...
  [
    { name: 'SQL', proficiency: 9 },
    { name: 'Data Modeling', proficiency: 8 },
    { name: 'ETL', proficiency: 7 },
    { name: 'Database Design', proficiency: 8 },
    { name: 'Business Intelligence', proficiency: 9 },
    { name: 'Data Warehousing', proficiency: 8 }
  ],
  // Set 6 for candidates 6, 16, 26...
  [
    { name: 'UI Design', proficiency: 9 },
    { name: 'Figma', proficiency: 9 },
    { name: 'Adobe XD', proficiency: 8 },
    { name: 'Interaction Design', proficiency: 8 },
    { name: 'Design Systems', proficiency: 7 },
    { name: 'Prototyping', proficiency: 9 }
  ],
  // Set 7 for candidates 7, 17, 27...
  [
    { name: 'DevOps', proficiency: 8 },
    { name: 'CI/CD', proficiency: 9 },
    { name: 'Docker', proficiency: 8 },
    { name: 'Kubernetes', proficiency: 7 },
    { name: 'AWS', proficiency: 8 },
    { name: 'Infrastructure as Code', proficiency: 7 }
  ],
  // Set 8 for candidates 8, 18, 28...
  [
    { name: 'Mobile Development', proficiency: 8 },
    { name: 'React Native', proficiency: 9 },
    { name: 'iOS', proficiency: 7 },
    { name: 'Android', proficiency: 7 },
    { name: 'App Store Optimization', proficiency: 8 },
    { name: 'Cross-platform Development', proficiency: 9 }
  ],
  // Set 9 for candidates 9, 19, 29...
  [
    { name: 'Sales Strategy', proficiency: 9 },
    { name: 'CRM', proficiency: 8 },
    { name: 'Lead Generation', proficiency: 8 },
    { name: 'Negotiation', proficiency: 9 },
    { name: 'Client Relationship', proficiency: 9 },
    { name: 'Sales Analytics', proficiency: 7 }
  ],
  // Set 10 for candidates 10, 20, 30...
  [
    { name: 'Data Science', proficiency: 9 },
    { name: 'Machine Learning', proficiency: 8 },
    { name: 'Statistics', proficiency: 8 },
    { name: 'R', proficiency: 7 },
    { name: 'Data Visualization', proficiency: 9 },
    { name: 'Predictive Modeling', proficiency: 8 }
  ]
];

// Helper function to get skills based on candidate ID
export function getSkillsForCandidate(candidateId: string | number): Skill[] {
  const id = typeof candidateId === 'string' ? parseInt(candidateId, 10) : candidateId;
  const skillSetIndex = (id - 1) % 10;
  return hardcodedSkillSets[skillSetIndex] || hardcodedSkillSets[0];
} 