# HireHub - Modern Recruitment Management System

HireHub is a comprehensive recruitment management system built with Next.js and TypeScript, designed to streamline the hiring process for HR professionals and recruiters.

## Features

### Dashboard
- Real-time metrics showing active jobs, new applications, shortlisted candidates, and top talent
- Interactive charts for application sources and recruitment pipeline
- Recent applications overview
- Upcoming interviews tracker
- Active jobs display
- Top talent showcase

### Candidate Management
- Kanban board view for candidate pipeline
- Advanced filtering by name, title, location, and recruitment stage
- Comprehensive candidate profiles including:
  - Personal information
  - Skills and experience
  - Education history
  - Assessment results
  - Interview feedback

### Job Management
- Create and manage job postings
- Define job requirements and responsibilities
- Set salary ranges and benefits
- Track applications per job
- Monitor recruitment pipeline stages

### Interview Management
- Schedule and track interviews
- Multiple interview types (Phone, Video, Onsite, Technical, HR)
- Interview feedback collection
- AI-powered assessment tools
- Automated scoring system

### Analytics
- Recruitment funnel analytics
- Time-to-hire metrics
- Source effectiveness tracking
- Pipeline conversion rates
- Job performance metrics

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Charts**: Recharts
- **State Management**: React Hooks
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hirehub.git
```

2. Install dependencies:
```bash
cd hirehub
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # Reusable React components
├── data/                  # Mock data and constants
├── lib/                   # Utility functions and helpers
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- React Icons for the comprehensive icon set
- All contributors who have helped shape this project 