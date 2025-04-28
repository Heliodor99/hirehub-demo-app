import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMail, FiUser, FiCheck, FiChevronRight, FiCalendar, FiPhone, FiFileText, FiVideo } from 'react-icons/fi';
import { useQuery, useMutation, gql } from '@apollo/client';
import type { Job } from '@/types';

const GET_DASHBOARD_STATS = gql`
  query DashboardStats($today: date!) {
    activeJobs: jobs_aggregate(where: {status: {_eq: "Active"}}) { aggregate { count } }
    shortlistedCandidates: candidates_aggregate(where: {stage: {_eq: "Shortlisted"}}) { aggregate { count } }
    topRankers: candidates_aggregate(where: {assessment: {_contains: {score: 85}}}) { aggregate { count } }
    newApplications: candidates_aggregate(where: {applied_date: {_eq: $today}}) { aggregate { count } }
    weeklyApplications: candidates { applied_date }
    jobs {
      id
      title
      location
      posted_date
      status
      candidates_aggregate {
        aggregate {
          count
        }
      }
    }
    tasks(order_by: {due_date: asc}) {
      id
      title
      description
      due_date
      priority
      status
      category
    }
    interviews(where: {date: {_gte: $today}}, order_by: {date: asc}) {
      id
      candidate_name
      candidate_position
      date
      time
      type
      status
    }
  }
`;

const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: String!, $status: String!) {
    update_tasks_by_pk(pk_columns: {id: $id}, _set: {status: $status}) {
      id
      status
    }
  }
`;

const BRAND = {
  blue: '#2B7BD3',
  teal: '#2ECDC3',
  purple: '#9B5CFF'
};

interface ApplicationsByJob {
  id: string;
  name: string;
  value: number;
}

export default function DashboardHome() {
  const today = new Date().toISOString().slice(0, 10);
  const { data, loading, error } = useQuery(GET_DASHBOARD_STATS, { variables: { today } });
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);

  // Add state for displayed month/year
  const todayDate = new Date();
  const [calendarMonth, setCalendarMonth] = useState(todayDate.getMonth());
  const [calendarYear, setCalendarYear] = useState(todayDate.getFullYear());

  // Filter interviews for the displayed month/year
  const filteredInterviews = useMemo(() => {
    return (data?.interviews || []).filter((interview: any) => {
      const date = new Date(interview.date);
      return date.getMonth() === calendarMonth && date.getFullYear() === calendarYear;
    });
  }, [data?.interviews, calendarMonth, calendarYear]);

  // Highlight interview days for the displayed month/year
  const interviewDays = useMemo(() => {
    return filteredInterviews.map((interview: any) => {
      const date = new Date(interview.date);
      return date.getDate();
    });
  }, [filteredInterviews]);

  // Helper to get month name
  const monthName = new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'short' });
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

  // Prepare all hooks at the top, using fallback values if data is not loaded yet
  const interviews = data?.interviews || [];

  // Add state for week offset
  const [weekOffset, setWeekOffset] = useState(0);

  // Calculate start and end of the displayed week
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay() === 0 ? 6 : d.getDay() - 1; // Monday as first day
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const baseDate = new Date();
  const startOfWeek = getStartOfWeek(new Date(baseDate.setDate(baseDate.getDate() + weekOffset * 7)));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  // Filter applications for the selected week
  const filteredWeeklyApplications = (data?.weeklyApplications || []).filter((c: { applied_date: string }) => {
    const date = new Date(c.applied_date);
    return date >= startOfWeek && date <= endOfWeek;
  });

  // Weekly Application Tracker
  const days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weeklyCounts: Record<string, number> = {};
  filteredWeeklyApplications.forEach((c: { applied_date: string }) => {
    const date = new Date(c.applied_date);
    const day = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
    weeklyCounts[day] = (weeklyCounts[day] || 0) + 1;
    });
  const weeklyData = days.map((day, _i) => weeklyCounts[day] || 0);
  const maxWeeklyValue = Math.max(...weeklyData, 1);

  // Helper for week range label
  const weekRangeLabel = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    
  // Applications by Job
  const applicationsByJob: ApplicationsByJob[] = (data?.jobs || []).map((job: any) => ({
    id: job.id,
    name: job.title,
    value: job.candidates_aggregate.aggregate.count
  }));

  // Tasks
  const tasks = data?.tasks || [];

  // Handle loading and error
  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading dashboard: {error.message}</div>;

  // Stats
  const activeJobCount = data?.activeJobs.aggregate.count ?? 0;
  const shortlistedCount = data?.shortlistedCandidates.aggregate.count ?? 0;
  const topRankingCount = data?.topRankers.aggregate.count ?? 0;
  const totalApplications = data?.newApplications.aggregate.count ?? 0;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-4 gap-6">
        {/* Top Row */}
        <div className="grid grid-cols-4 col-span-4 gap-6">
          {/* Hello Recruiter */}
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
                    <h2 className="text-4xl font-bold">{activeJobCount}</h2>
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

              {/* HirehubAI Top Rankers */}
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Weekly Application Tracker</h3>
                <div className="flex items-center gap-2">
                  <button className="p-1" style={{ color: BRAND.blue }} onClick={() => setWeekOffset(weekOffset - 1)}>◀</button>
                  <span className="text-sm text-gray-600">{weekRangeLabel}</span>
                  <button className="p-1" style={{ color: BRAND.blue }} onClick={() => setWeekOffset(weekOffset + 1)}>▶</button>
                </div>
              </div>
              <div className="h-48 relative">
                <div className="absolute left-0 h-[75%] flex flex-col justify-between text-xs text-gray-500 top-4">
                  <span>{maxWeeklyValue}</span>
                  <span>{Math.round(maxWeeklyValue * 0.75)}</span>
                  <span>{Math.round(maxWeeklyValue * 0.5)}</span>
                  <span>{Math.round(maxWeeklyValue * 0.25)}</span>
                  <span>0</span>
                </div>
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
                <div className="ml-10 flex justify-between text-xs text-gray-500 px-2 mt-2">
                  {days.map((day, i) => (
                    <span key={i} className="w-8 text-center">{day.substring(0, 3)}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Applications by Job - 1w x 4h */}
          <div className="col-span-1 row-span-4 bg-white rounded-lg shadow-sm p-6 h-[500px]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold">Applications by Job</h3>
              <p className="text-gray-500 text-sm">Total candidates applied for each job</p>
            </div>
            <div className="flex-1 flex flex-col h-[400px]">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-40 h-40 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {applicationsByJob.map((job: ApplicationsByJob, index: number, array: ApplicationsByJob[]) => {
                      const colors = [BRAND.blue, '#60A5FA', BRAND.purple, BRAND.teal];
                      const total = array.reduce((sum: number, j: ApplicationsByJob) => sum + j.value, 0);
                      const startPercent = array
                        .slice(0, index)
                        .reduce((sum: number, j: ApplicationsByJob) => sum + j.value, 0) / total;
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
                      {applicationsByJob.reduce((sum, job) => sum + job.value, 0)}
                    </text>
                  </svg>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {applicationsByJob.map((job: ApplicationsByJob, index: number) => (
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
              <h3 className="text-lg font-semibold">Active Job Post, {activeJobCount}</h3>
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
                  {data?.jobs.filter((job: any) => job.status === 'Active').map((job: any) => {
                    const postedDate = new Date(job.posted_date);
                    const formattedDate = `${postedDate.getDate()} ${postedDate.toLocaleString('default', { month: 'short' })}, ${postedDate.getFullYear()}`;
                    const applications = job.candidates_aggregate.aggregate.count;
                    return (
                      <tr key={job.id}>
                        <td className="py-3 px-4 text-sm">{formattedDate}</td>
                        <td className="py-3 px-4 text-sm">
                          <Link href={`/jobs/${job.id}`} className="text-blue-600 hover:underline" style={{ color: BRAND.blue }}>
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
                          <Link href={`/jobs/${job.id}`}>
                          <button className="p-1 text-white rounded" style={{ backgroundColor: BRAND.blue }}>
                            <FiChevronRight />
                          </button>
                          </Link>
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
              {tasks.map((task: any) => (
                <div key={task.id} className="flex items-start border-b border-gray-100 pb-4">
                  <div className="mt-0.5 mr-3 text-gray-400">
                    <FiFileText />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className={`text-sm ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
                      <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{task.due_date}</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div 
                      className="w-5 h-5 border rounded flex items-center justify-center cursor-pointer transition-colors"
                      style={{ 
                        borderColor: task.status === 'Completed' ? BRAND.teal : BRAND.blue,
                        backgroundColor: task.status === 'Completed' ? BRAND.teal : 'transparent',
                        color: task.status === 'Completed' ? 'white' : BRAND.blue
                      }}
                      onClick={async () => {
                        console.log('Checkbox clicked for task:', task.id, 'Current status:', task.status);
                        try {
                          const result = await updateTaskStatus({ 
                            variables: { id: task.id.toString(), status: task.status === 'Completed' ? 'Pending' : 'Completed' },
                            refetchQueries: [{ query: GET_DASHBOARD_STATS, variables: { today } }],
                            awaitRefetchQueries: true
                          });
                          console.log('Mutation result:', result);
                        } catch (err) {
                          console.error('Failed to update task status:', err);
                        }
                      }}
                    >
                      {task.status === 'Completed' && <FiCheck className="w-3 h-3" />}
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
                <span className="text-sm text-gray-600 mr-2">{monthName}, {calendarYear}</span>
                <button className="p-1" style={{ color: BRAND.blue }} onClick={() => {
                  setCalendarMonth(prev => prev === 0 ? 11 : prev - 1);
                  if (calendarMonth === 0) setCalendarYear(y => y - 1);
                }}>◀</button>
                <button className="p-1" style={{ color: BRAND.blue }} onClick={() => {
                  setCalendarMonth(prev => prev === 11 ? 0 : prev + 1);
                  if (calendarMonth === 11) setCalendarYear(y => y + 1);
                }}>▶</button>
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
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const isToday = day === todayDate.getDate() && calendarMonth === todayDate.getMonth() && calendarYear === todayDate.getFullYear();
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
                {filteredInterviews.slice(0, 3).map((interview: any) => {
                  const date = new Date(interview.date);
                  const formattedTime = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                  const formattedDate = date.toLocaleDateString([], {day: 'numeric', month: 'short'});
                  return (
                    <div key={interview.id} className="border-l-2 pl-3 py-1" style={{ borderColor: BRAND.purple }}>
                      <div className="flex items-center">
                        <FiVideo className="mr-2 text-gray-400" />
                        <div>
                          <p className="text-xs font-medium">Interview with {interview.candidate_name}</p>
                          <p className="text-xs text-gray-500">{formattedDate}, {formattedTime}</p>
                          <p className="text-xs text-gray-400">{interview.candidate_position}</p>
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