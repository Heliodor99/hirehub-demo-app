import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMail, FiUser, FiCheck, FiChevronRight, FiCalendar, FiPhone, FiFileText, FiVideo } from 'react-icons/fi';
import { jobs } from '@/data/jobs';
import { candidates } from '@/data/candidates';
import { RecruitmentStage } from '@/types';

// Brand colors
const BRAND = {
  blue: '#2B7BD3',
  teal: '#2ECDC3',
  purple: '#9B5CFF'
};

// Task interface
interface Task {
  id: number;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
  dueDate: string;
}

// Interview interface
interface Interview {
  id: number;
  candidateName: string;
  position: string;
  date: Date;
  jobId: string;
}

export default function DashboardHome() {
  // Filter active jobs
  const activeJobs = useMemo(() => {
    return jobs.filter(job => job.status === 'Active');
  }, []);

  // Get total job count
  const activeJobCount = useMemo(() => {
    return activeJobs.length;
  }, [activeJobs]);

  // Fixed total of 95 applications (changed from 200)
  const TOTAL_APPLICATIONS = 95;

  // Count applications by job with fixed total of 95
  const applicationsByJob = useMemo(() => {
    // Distribute applications proportionally with some randomness
    const baseCount = Math.floor(TOTAL_APPLICATIONS / activeJobs.length);
    let remaining = TOTAL_APPLICATIONS;
    
    return activeJobs.map((job, index) => {
      // For the last job, use all remaining applications to ensure total is exactly 95
      let count;
      if (index === activeJobs.length - 1) {
        count = remaining;
      } else {
        // Add some randomness but ensure we don't exceed total
        const variance = Math.floor(baseCount * 0.3 * (Math.random() - 0.5));
        count = Math.min(remaining - (activeJobs.length - index - 1), baseCount + variance);
      }
      
      remaining -= count;
      
      return {
        id: job.id,
        name: job.title,
        value: count
      };
    });
  }, [activeJobs]);

  // Total applications is now fixed at 95
  const totalApplications = useMemo(() => {
    return TOTAL_APPLICATIONS;
  }, []);

  // Fixed shortlisted count at 47
  const shortlistedCount = 47;

  // Count top ranking candidates (those with high assessment scores)
  const topRankingCount = useMemo(() => {
    return candidates.filter(candidate => 
      candidate.assessment && candidate.assessment.score > 85
    ).length || 10; // Default to 10 if no data
  }, []);

  // Mock interviews for the schedule
  const mockInterviews = useMemo<Interview[]>(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return [
      {
        id: 1,
        candidateName: "Amit Singh",
        position: activeJobs[0]?.title || "Senior Frontend Developer",
        date: new Date(today.setHours(10, 0, 0)),
        jobId: activeJobs[0]?.id || "1"
      },
      {
        id: 2,
        candidateName: "Priya Patel",
        position: activeJobs[1]?.title || "Product Manager",
        date: new Date(today.setHours(14, 30, 0)),
        jobId: activeJobs[1]?.id || "2"
      },
      {
        id: 3,
        candidateName: "Raj Malhotra",
        position: activeJobs[2]?.title || "Data Scientist",
        date: new Date(tomorrow.setHours(11, 0, 0)),
        jobId: activeJobs[2]?.id || "3"
      },
      {
        id: 4,
        candidateName: "Siddharth Mehta",
        position: activeJobs[0]?.title || "Senior Frontend Developer",
        date: new Date(dayAfterTomorrow.setHours(15, 0, 0)),
        jobId: activeJobs[0]?.id || "1"
      },
      {
        id: 5,
        candidateName: "Neha Gupta",
        position: activeJobs[3]?.title || "DevOps Engineer",
        date: new Date(nextWeek.setHours(10, 30, 0)),
        jobId: activeJobs[3]?.id || "4"
      }
    ];
  }, [activeJobs]);

  // Create more realistic tasks related to real jobs and candidates
  const initialTasks = useMemo<Task[]>(() => {
    const jobTitles = activeJobs.map(job => job.title);
    const randomCandidates = ["Raghav Sharma", "Siddharth Mehta", "Priya Patel", "Neha Gupta", "Amit Singh", "Kavita Reddy"];
    
    return [
      {
        id: 1,
        description: `Review ${randomCandidates[0]}'s application for ${jobTitles[0] || 'Senior Frontend Developer'}`,
        completed: false,
        icon: <FiFileText />,
        dueDate: "Today"
      },
      {
        id: 2,
        description: `Interview scheduled with ${randomCandidates[1]} at 3:00 PM for ${jobTitles[1] || 'Product Manager'}`,
        completed: false,
        icon: <FiCalendar />,
        dueDate: "Today"
      },
      {
        id: 3,
        description: `Call ${randomCandidates[2]} to discuss offer details`,
        completed: true,
        icon: <FiPhone />,
        dueDate: "Yesterday"
      },
      {
        id: 4,
        description: `Send assessment test to ${randomCandidates[3]} for ${jobTitles[2] || 'Data Scientist'} position`,
        completed: false,
        icon: <FiMail />,
        dueDate: "Tomorrow"
      },
      {
        id: 5,
        description: `Follow up with ${randomCandidates[4]} about reference check`,
        completed: false,
        icon: <FiUser />,
        dueDate: "Tomorrow"
      },
      {
        id: 6,
        description: `Update hiring manager about ${jobTitles[3] || 'DevOps Engineer'} candidates`,
        completed: false,
        icon: <FiFileText />,
        dueDate: "24 Mar"
      }
    ];
  }, [activeJobs]);

  // State for task completion
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Toggle task completion
  const toggleTaskCompletion = (taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const days = useMemo(() => {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  }, []);

  // Weekly application data
  const weeklyData = useMemo(() => {
    return days.map((day, index) => {
      // Generate a realistic distribution of applications across the week
      const multiplier = [0.8, 1.2, 1.5, 1.3, 1.0, 0.6, 0.4][index];
      return Math.floor((totalApplications / 7) * multiplier);
    });
  }, [days, totalApplications]);

  // Find days with interviews for calendar highlighting
  const interviewDays = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get the days of the month for each interview
    return mockInterviews.map(interview => {
      // Only include interviews from the current month
      if (interview.date.getMonth() === currentMonth && 
          interview.date.getFullYear() === currentYear) {
        return interview.date.getDate();
      }
      return null;
    }).filter(day => day !== null);
  }, [mockInterviews]);

  // Calculate max value for the weekly chart to ensure proper scaling
  const maxWeeklyValue = useMemo(() => {
    const max = Math.max(...weeklyData);
    // Round up to the nearest 5 for a clean scale
    return Math.ceil(max / 5) * 5;
  }, [weeklyData]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-4 gap-6">
        {/* Top Row */}
        <div className="grid grid-cols-4 col-span-4 gap-6">
          {/* Hello Recruiter - 1w x 4h */}
          <div className="col-span-1 row-span-4 bg-blue-50 rounded-lg shadow-sm relative overflow-hidden h-[500px]" style={{ backgroundColor: `${BRAND.blue}15` }}>
            <div className="h-full relative">
              <div className="w-full flex justify-center">
                <Image 
                  src="/images/Frame 26087192 (11).png" 
                  alt="Recruiter illustration" 
                  width={300} 
                  height={300}
                  className="w-full h-auto object-contain pt-6"
                  priority
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 pt-8 pb-6 px-6 text-center">
                <h2 className="text-xl font-semibold">Hello Recruiter !</h2>
                <p className="text-gray-600 text-sm mt-4 mb-6 mx-auto max-w-[240px]">
                  Good Morning! You have {totalApplications} new applications. Let's select the right candidate today!
                </p>
                <button className="text-white px-10 py-2 rounded-md hover:opacity-90 font-medium" style={{ backgroundColor: BRAND.blue }}>
                  Review
                </button>
              </div>
            </div>
          </div>

          {/* Middle Column - Stats Cards + Weekly Application Tracker */}
          <div className="col-span-2 row-span-4 grid grid-rows-2 gap-6 h-[500px]">
            {/* Stats Cards - 2x2 grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Active Job Posts */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-4xl font-bold">0{activeJobCount}</h2>
                    <p className="text-gray-600 mt-1">Active Job Post{activeJobCount !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.teal}15` }}>
                    <FiCheck className="w-5 h-5" style={{ color: BRAND.teal }} />
                  </div>
                </div>
              </div>

              {/* Shortlisted Candidates */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-4xl font-bold">{shortlistedCount}</h2>
                    <p className="text-gray-600 mt-1">Shortlisted Candidates</p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.blue}15` }}>
                    <FiUser className="w-5 h-5" style={{ color: BRAND.blue }} />
                  </div>
                </div>
              </div>

              {/* HirehubAI Top Rankers - renamed from Top Ranking Candidates */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-4xl font-bold">{topRankingCount}</h2>
                    <p className="text-gray-600 mt-1">HirehubAI Top Rankers</p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.purple}15` }}>
                    <FiUser className="w-5 h-5" style={{ color: BRAND.purple }} />
                  </div>
                </div>
              </div>

              {/* New Applications Count */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-4xl font-bold">{totalApplications}</h2>
                    <p className="text-gray-600 mt-1">New Applications</p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.teal}15` }}>
                    <FiMail className="w-5 h-5" style={{ color: BRAND.teal }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Application Tracker */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Weekly Application Tracker</h3>
              <div className="h-48 relative">
                {/* Y-axis labels - Updated to use dynamic max value and fewer steps */}
                <div className="absolute left-0 h-[75%] flex flex-col justify-between text-xs text-gray-500 top-4">
                  <span>{maxWeeklyValue}</span>
                  <span>{Math.round(maxWeeklyValue * 0.75)}</span>
                  <span>{Math.round(maxWeeklyValue * 0.5)}</span>
                  <span>{Math.round(maxWeeklyValue * 0.25)}</span>
                  <span>0</span>
                </div>
                
                {/* Chart container with bars */}
                <div className="ml-10 h-[75%] bg-white rounded flex items-end justify-between px-2 mt-4 border border-gray-100">
                  {weeklyData.map((value, index) => (
                    <div 
                      key={index} 
                      className="w-8 rounded-t-sm" 
                      style={{
                        height: `${(value / maxWeeklyValue) * 100}%`,
                        backgroundColor: index % 2 === 0 ? BRAND.blue : BRAND.teal
                      }}
                    ></div>
                  ))}
                </div>
                
                {/* X-axis labels - positioned at the bottom of the container */}
                <div className="ml-10 flex justify-between text-xs text-gray-500 px-2 mt-2">
                  {days.map((day, i) => (
                    <span key={i} className="w-8 text-center">{day.substring(0, 3)}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* New Applications Chart - 1w x 4h */}
          <div className="col-span-1 row-span-4 bg-white rounded-lg shadow-sm p-6 h-[500px]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold">New Applications</h3>
              <p className="text-gray-500 text-sm">Latest applications received</p>
            </div>
            <div className="flex-1 flex flex-col h-[400px]">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-40 h-40 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {applicationsByJob.map((job, index, array) => {
                      const colors = [BRAND.blue, '#60A5FA', BRAND.purple, BRAND.teal];
                      const total = array.reduce((sum, j) => sum + j.value, 0);
                      const startPercent = array
                        .slice(0, index)
                        .reduce((sum, j) => sum + j.value, 0) / total;
                      const percent = job.value / total;
                      
                      return (
                        <circle 
                          key={job.id}
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="transparent" 
                          stroke={colors[index % colors.length]} 
                          strokeWidth="20" 
                          strokeDasharray={`${percent * 251.2} ${(1 - percent) * 251.2}`} 
                          strokeDashoffset={`${-startPercent * 251.2}`} 
                          transform="rotate(-90 50 50)" 
                        />
                      );
                    })}
                    <circle cx="50" cy="50" r="30" fill="white" />
                    <text 
                      x="50" 
                      y="50" 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      fontSize="16" 
                      fontWeight="bold"
                    >
                      {totalApplications}
                    </text>
                  </svg>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {applicationsByJob.map((job, index) => (
                  <div key={job.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ 
                          backgroundColor: 
                            index === 0 ? BRAND.blue : 
                            index === 1 ? '#60A5FA' : 
                            index === 2 ? BRAND.purple : BRAND.teal
                        }}
                      />
                      <span className="text-sm">{job.name}</span>
                    </div>
                    <span className="font-medium">{job.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-4 col-span-4 gap-6 mt-6">
          {/* Active Jobs Table - 2w x 4h */}
          <div className="col-span-2 bg-white rounded-lg shadow-sm overflow-hidden h-[500px] flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Active Job Post,0{activeJobCount}</h3>
              <div className="flex items-center text-gray-500 text-sm">
                <span>New ones first</span>
                <FiChevronRight className="ml-2 transform rotate-90" />
              </div>
            </div>
            <div className="overflow-auto flex-1">
              <table className="min-w-full">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4 text-left tracking-wider">Date</th>
                    <th className="py-3 px-4 text-left tracking-wider">Position</th>
                    <th className="py-3 px-4 text-left tracking-wider">Location</th>
                    <th className="py-3 px-4 text-left tracking-wider">Applications</th>
                    <th className="py-3 px-4 text-left tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeJobs.map((job, index) => {
                    const postedDate = new Date(job.postedDate);
                    const formattedDate = `${postedDate.getDate()} ${postedDate.toLocaleString('default', { month: 'short' })}, ${postedDate.getFullYear()}`;
                    const applications = applicationsByJob.find(j => j.id === job.id)?.value || 0;
                    
                    return (
                      <tr key={job.id}>
                        <td className="py-3 px-4 text-sm">{formattedDate}</td>
                        <td className="py-3 px-4 text-sm">
                          <Link href={`/job/${job.id}`} className="text-blue-600 hover:underline" style={{ color: BRAND.blue }}>
                            {job.title}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-sm">{job.location}</td>
                        <td className="py-3 px-4 text-sm">{applications}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs" style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal }}>
                            {job.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="p-1 text-white rounded" style={{ backgroundColor: BRAND.blue }}>
                            <FiChevronRight />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* My Tasks - 1w x 4h */}
          <div className="col-span-1 bg-white rounded-lg shadow-sm p-5 h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold">My Tasks</h3>
              <button className="w-6 h-6 text-white rounded-md flex items-center justify-center" style={{ backgroundColor: BRAND.blue }}>
                <span>+</span>
              </button>
            </div>
            <div className="space-y-4 flex-1 overflow-auto">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-start border-b border-gray-100 pb-4">
                  <div className="mt-0.5 mr-3 text-gray-400">
                    {task.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.description}</p>
                      <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{task.dueDate}</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div 
                      className="w-5 h-5 border rounded flex items-center justify-center cursor-pointer transition-colors"
                      style={{ 
                        borderColor: task.completed ? BRAND.teal : BRAND.blue,
                        backgroundColor: task.completed ? BRAND.teal : 'transparent',
                        color: task.completed ? 'white' : BRAND.blue
                      }}
                      onClick={() => toggleTaskCompletion(task.id)}
                    >
                      {task.completed && <FiCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule - 1w x 4h */}
          <div className="col-span-1 bg-white rounded-lg shadow-sm p-5 h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Schedule</h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Mar, 2025</span>
                <button className="p-1" style={{ color: BRAND.blue }}>◀</button>
                <button className="p-1" style={{ color: BRAND.blue }}>▶</button>
              </div>
            </div>
            
            <div className="mt-4 flex-1">
              <div className="grid grid-cols-7 text-center mb-2">
                <div className="text-xs text-gray-500">Mon</div>
                <div className="text-xs text-gray-500">Tue</div>
                <div className="text-xs text-gray-500">Wed</div>
                <div className="text-xs text-gray-500">Thu</div>
                <div className="text-xs text-gray-500">Fri</div>
                <div className="text-xs text-gray-500">Sat</div>
                <div className="text-xs text-gray-500">Sun</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-xs">
                {[...Array(28)].map((_, i) => {
                  const day = i + 1;
                  const isToday = day === 27;
                  const hasInterview = interviewDays.includes(day);
                  
                  return (
                    <div 
                      key={day} 
                      className={`h-7 w-7 flex items-center justify-center relative
                        ${isToday ? 'text-white rounded-full' : ''}
                      `}
                      style={isToday ? { backgroundColor: BRAND.blue } : {}}
                    >
                      {day}
                      {hasInterview && (
                        <span 
                          className="absolute bottom-0 w-1 h-1 rounded-full"
                          style={{ backgroundColor: BRAND.purple }}
                        ></span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Upcoming Interviews</h4>
                {mockInterviews.slice(0, 3).map(interview => {
                  const formattedTime = interview.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                  const formattedDate = interview.date.toLocaleDateString([], {day: 'numeric', month: 'short'});
                  
                  return (
                    <div key={interview.id} className="border-l-2 pl-3 py-1" style={{ borderColor: BRAND.purple }}>
                      <div className="flex items-center">
                        <FiVideo className="mr-2 text-gray-400" />
                        <div>
                          <p className="text-xs font-medium">Interview with {interview.candidateName}</p>
                          <p className="text-xs text-gray-500">{formattedDate}, {formattedTime}</p>
                          <p className="text-xs text-gray-400">{interview.position}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 