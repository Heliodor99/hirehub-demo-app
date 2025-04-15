<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Product Requirements Document: HireHub.AI – Automated Hiring Platform Demo

## 1. Introduction

HireHub.AI is an intelligent hiring platform that leverages AI to streamline the recruitment process, from job posting to candidate selection. This document outlines the requirements for developing a demo version of the platform that showcases its core capabilities without requiring backend integration.

## 2. Product Overview

HireHub.AI positions itself as "Your Autopilot for Hiring," offering an intelligence-driven system designed to optimize hiring workflows and enhance decision-making in talent search. The demo will highlight key features including AI-powered job description creation, candidate matching, application tracking, and intelligent candidate assessment.

## 3. Target Audience

- Hiring managers and recruiters
- HR professionals
- Talent acquisition teams
- Company executives overseeing hiring processes


## 4. User Personas

### 4.1 Primary Persona: Rachel, Senior Recruiter

- Manages multiple job openings simultaneously
- Needs to efficiently screen large volumes of applications
- Values automation tools that reduce manual resume review
- Seeks data-driven insights to improve hiring decisions


### 4.2 Secondary Persona: Michael, Hiring Manager

- Needs clarity on candidate pipeline and progress
- Wants to stay informed about upcoming interviews
- Requires detailed candidate assessments that align with job requirements
- Has limited time to review applications manually


## 5. Functional Requirements

### 5.1 Authentication System (Demo Only)

- **Login Page**
    - Email/password fields with "Remember me" option
    - Forgot password link (non-functional in demo)
    - "Request a Demo" button for new users
    - Brand positioning statement visible on landing page
    - Form validation for email format


### 5.2 Dashboard

- **Key Metrics Display**
    - Active job posts count (06 in demo)
    - New applications count (100 in demo)
    - Shortlisted candidates count (64 in demo)
    - Top ranking candidates count (10 in demo)
- **Personalized Welcome Message**
    - Dynamic greeting based on time of day
    - Summary of new applications (e.g., "You have 100 new applications. Let's select the right candidate today!")
    - Quick action "Review" button
- **Source of Applications Chart**
    - Line graph visualization showing application sources (Website, LinkedIn, Indeed, Upwork, Naukri)
    - Interactive elements showing exact values on hover
    - Color-coded lines for different job positions
- **Active Job Listings Table**
    - Columns: Date, Position, Location, Applications, Status, Actions
    - Sortable by newest first (default) or customizable
    - Status indicators (Active, Inactive, On Hold)
    - Quick action buttons for each job
- **Calendar Widget**
    - Monthly view with current month highlighted
    - Visual indicators for days with scheduled events
    - Upcoming interviews and important dates highlighted
    - Detailed event information on selected date
    - Today's date prominently marked
- **My Task Widget**
    - Task list with priority indicators
    - Checkboxes for completion status
    - Task categorization (interviews, updates, coordination)
    - Due dates for time-sensitive tasks
    - Quick-add task button


### 5.3 Job Management

- **All Jobs View**
    - Filterable list of all jobs
    - Quick status overview (active, closed, draft)
    - Search functionality by job title or location
    - Sort options by date posted, applications count, etc.
- **Individual Job Page**
    - Complete job description and requirements
    - Application statistics (views, applications, stage breakdown)
    - Candidate pipeline visualization
    - Status update controls
    - Related tasks and upcoming interviews
- **Job Creation Process**
    - Three-step wizard UI (step indicator at top)
    - Rich text editor for job description
    - AI-powered formatting assistance button ("Reformat with AI")
    - Upload functionality for existing job descriptions
    - AI enrichment feature ("Enrich with AI") that expands basic job details into comprehensive descriptions
    - Preview capability before publishing
    - Auto-save functionality for drafts


### 5.4 Candidate Management

- **Candidate Search \& Filtering**
    - Advanced search with pre-filled filters functionality
    - Detailed filter categories:
        - Basic details (languages, location, name)
        - Experience \& education filters
        - Skills assessment filters
        - Company history filters
        - Keyword search functionality
    - Save search feature for commonly used filters
- **Candidate Profile View**
    - Professional summary section
    - Experience timeline
    - Skills visualization with proficiency indicators
    - Education background
    - Certification details
    - AI-generated assessment section showing:
        - Strengths for the specific role
        - Potential gaps/areas of concern
        - Match percentage for the job requirements
        - Comparative analysis if applied to multiple roles
- **Application Tracking**
    - Stage visualization (Applied, Screened, Interviewed, Offered, etc.)
    - Timeline of candidate interactions
    - Interview feedback collection
    - Document management (resume, portfolio, etc.)
    - Communication history


### 5.5 Settings \& Configuration

- **Company Profile**
    - Basic company information (name, industry, size)
    - Brand assets management (logo, colors)
    - Office locations
    - Team structure
    - Company description and culture information
- **User Preferences**
    - Notification settings
    - Display preferences
    - Calendar integration options
    - Language and regional settings


## 6. UI/UX Requirements

### 6.1 General Design Guidelines

- Clean, professional interface with ample white space
- Blue and white primary color scheme with yellow accents
- Responsive design for various screen sizes
- Consistent navigation pattern throughout the application
- Card-based UI elements for modular information display
- Iconography for improved visual scanning


### 6.2 Specific UI Components

- **Navigation**
    - Left sidebar for main navigation categories:
        - Dashboard
        - Job
        - Candidate Profiles
        - Report \& Analytics
        - Admin \& Settings
    - Top header with search, notifications, settings, and user profile
    - "Post a Job" button consistently available in header
- **Dashboard Widgets**
    - Rectangular cards with rounded corners
    - Hover effects for interactive elements
    - Icons paired with numerical data
    - Donut and line charts for data visualization
    - Task checklist with completion indicators
- **Job Creation Interface**
    - Multi-column layout
    - Text formatting toolbar
    - Right-side information panel with AI assistance options
    - Progress indicator for multi-step processes
    - Preview/continue buttons at bottom
- **Candidate Search Interface**
    - Left sidebar for filters
    - Main content area for results
    - Clear search and advance search buttons
    - Tag-based selection for multi-select filters


### 6.3 Interaction Design

- All widgets should expand when clicked to show additional details
- Tooltips for functionality explanation on hover
- Drag-and-drop functionality for rearranging dashboard components
- Smooth transitions between sections
- Confirmation dialogs for important actions
- Inline editing capabilities where appropriate


## 7. Sample Data Requirements

### 7.1 Sample Job Listings

- **UI/UX Designer**
    - Location: Bangalore
    - Applications: 42
    - Status: Active
    - Description: Include responsibilities focused on user research, wireframing, prototyping, and usability testing
    - Requirements: Proficiency in Figma, Adobe XD, knowledge of design principles, 3-5 years experience
- **Sales Executive**
    - Location: Mumbai
    - Applications: 28
    - Status: Active
    - Description: Include responsibilities focused on lead generation, client relationships, and sales targets
    - Requirements: B2B sales experience, excellent communication skills, CRM familiarity
- **Full Stack Developer**
    - Location: Gurgaon
    - Applications: 120
    - Status: Active
    - Description: Include responsibilities focused on end-to-end application development, code reviews, and technical specifications
    - Requirements: Proficiency in React, Node.js, database management, API development
- **AI Intern for Automation**
    - Location: Remote
    - Applications: 64
    - Status: On Hold
    - Description: Include responsibilities focused on ML model development, data analysis, and automation script creation
    - Requirements: Knowledge of Python, machine learning fundamentals, statistics background


### 7.2 Sample Candidate Profiles

- Create 5-10 detailed candidate profiles for each job listing
- Include varied levels of experience and skill matches
- Ensure diversity in educational background and career paths
- Create some candidates who have applied to multiple positions


## 8. Demo Workflow Scenarios

### 8.1 Job Posting Scenario

1. Login to dashboard
2. Click "Post a Job" button
3. Enter basic job details manually
4. Demonstrate "Reformat with AI" feature to improve formatting
5. Show "Enrich with AI" capability by entering minimal job details and expanding into comprehensive description
6. Preview job posting
7. Complete posting process

### 8.2 Candidate Review Scenario

1. Navigate to active job posting
2. View application statistics
3. Filter candidates based on specific criteria
4. Open candidate profile
5. Review AI-generated pros/cons assessment
6. Schedule interview via calendar integration
7. Add task for follow-up

### 8.3 Dashboard Overview Scenario

1. Login to system
2. Explain key metrics and their significance
3. Demonstrate interactive elements in charts
4. Show calendar functionality and upcoming interviews
5. Review and complete tasks from My Tasks widget

## 9. Technical Considerations (For Demo)

### 9.1 Frontend Requirements

- React.js framework for component-based UI
- Chart.js or D3.js for data visualizations
- React Router for navigation
- Styled components or SASS for styling
- Redux or Context API for state management
- Mock API responses using JSON files for simulated data


### 9.2 Performance Requirements

- Immediate UI response (no simulated loading unless specifically demonstrating loading states)
- Smooth transitions between views
- Responsive design for demonstration on various devices


### 9.3 Browser Compatibility

- Chrome (latest version)
- Firefox (latest version)
- Safari (latest version)
- Edge (latest version)


## 10. Demo Data Structure

### 10.1 Job Data Structure

```javascript
{
  id: String,
  title: String,
  department: String,
  location: String,
  type: String, // Full-time, Part-time, Contract
  status: String, // Active, Inactive, On Hold
  datePosted: Date,
  applications: Number,
  description: {
    summary: String,
    responsibilities: Array&lt;String&gt;,
    requirements: Array&lt;String&gt;,
    benefits: Array&lt;String&gt;
  },
  applicationSources: {
    website: Number,
    linkedin: Number,
    indeed: Number,
    upwork: Number,
    naukri: Number
  },
  stages: {
    applied: Number,
    screening: Number,
    interview: Number,
    assessment: Number,
    offer: Number,
    hired: Number,
    rejected: Number
  }
}
```


### 10.2 Candidate Data Structure

```javascript
{
  id: String,
  name: {
    first: String,
    last: String
  },
  contact: {
    email: String,
    phone: String,
    location: String
  },
  experience: Array&lt;{
    title: String,
    company: String,
    duration: {
      start: Date,
      end: Date
    },
    responsibilities: Array&lt;String&gt;
  }&gt;,
  education: Array&lt;{
    degree: String,
    institution: String,
    year: Number
  }&gt;,
  skills: Array&lt;{
    name: String,
    proficiency: Number // 1-5
  }&gt;,
  applications: Array&lt;{
    jobId: String,
    status: String,
    appliedDate: Date,
    aiAssessment: {
      strengths: Array&lt;String&gt;,
      concerns: Array&lt;String&gt;,
      matchPercentage: Number
    }
  }&gt;
}
```


## 11. Success Metrics for Demo

- Engagement time during demo (target: 15-20 minutes)
- Number of features successfully demonstrated
- Positive feedback on AI capabilities
- Client understanding of platform value proposition
- Follow-up questions/engagement after demo

---

This PRD is structured to provide comprehensive guidance for developing an effective demo of the HireHub.AI platform, focusing on showcasing the key AI-powered features and user interfaces as shown in the uploaded designs.

<div>⁂</div>

[^1]: https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/28944546/7fe5f9ea-36ad-4db3-a91e-088b068c93cc/JD-Company-Data-Points-from-TheHireHub.docx

[^2]: https://pplx-res.cloudinary.com/image/upload/v1744611991/user_uploads/EFMiAyLTFdJfeYV/Form-5-from-Figma.jpg

[^3]: https://pplx-res.cloudinary.com/image/upload/v1744611991/user_uploads/bVAAwLodKnWspWA/Dashboard-Job.jpg

[^4]: https://pplx-res.cloudinary.com/image/upload/v1744611992/user_uploads/JkTryOEdNoriLxh/Sales-Enquiry-Landing-Page.jpg

[^5]: https://pplx-res.cloudinary.com/image/upload/v1744612002/user_uploads/fztEhIzTLJfZZfT/Form-Filled-from-Figma.jpg

