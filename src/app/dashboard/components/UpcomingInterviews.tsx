import Link from 'next/link';
import { FiCalendar, FiClock, FiUser, FiVideo, FiMapPin, FiBriefcase, FiUsers } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';
import { format, addDays, isToday, isTomorrow, isPast } from 'date-fns';

export default function UpcomingInterviews() {
  // Get upcoming interviews and include recent past ones
  const today = new Date();
  const threeDaysAgo = addDays(today, -3);
  
  const allInterviews = candidates
    .filter(candidate => 
      candidate.interview && 
      candidate.interview.date && 
      new Date(candidate.interview.date) >= threeDaysAgo
    )
    .sort((a, b) => {
      if (!a.interview || !b.interview) return 0;
      const aDate = new Date(`${a.interview.date} ${a.interview.time || '00:00'}`);
      const bDate = new Date(`${b.interview.date} ${b.interview.time || '00:00'}`);
      return aDate.getTime() - bDate.getTime();
    })
    .slice(0, 5);

  // Get job title for a candidate
  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || 'Unknown Position';
  };

  // Format interview date with relative hints
  const formatInterviewDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      
      if (isToday(date)) {
        return 'Today';
      } else if (isTomorrow(date)) {
        return 'Tomorrow';
      } else {
        return format(date, 'MMM d, yyyy');
      }
    } catch (error) {
      return dateStr;
    }
  };

  // Format time
  const formatTime = (time: string = '00:00') => {
    try {
      // If the time is already in 12-hour format, just return it
      if (time.toLowerCase().includes('am') || time.toLowerCase().includes('pm')) {
        return time;
      }

      return format(new Date(`2000-01-01T${time}`), 'h:mm a');
    } catch (error) {
      return time;
    }
  };

  // Get status text and style
  const getStatusInfo = (interview: any, date: string) => {
    const interviewDate = new Date(`${date} ${interview.time || '00:00'}`);
    
    if (interview.status === 'Completed') {
      return {
        text: 'Completed',
        className: 'bg-green-100 text-green-800'
      };
    } else if (interview.status === 'Cancelled') {
      return {
        text: 'Cancelled',
        className: 'bg-red-100 text-red-800'
      };
    } else if (isPast(interviewDate)) {
      return {
        text: 'Missed',
        className: 'bg-orange-100 text-orange-800'
      };
    } else if (isToday(interviewDate)) {
      return {
        text: 'Today',
        className: 'bg-blue-100 text-blue-800'
      };
    } else {
      return {
        text: 'Scheduled',
        className: 'bg-purple-100 text-purple-800'
      };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {allInterviews.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No upcoming interviews scheduled
          </div>
        ) : (
          allInterviews.map((candidate) => {
            if (!candidate.interview) return null;
            const { text: statusText, className: statusClass } = getStatusInfo(
              candidate.interview, 
              candidate.interview.date
            );
            
            return (
              <div key={candidate.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <FiUser className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <Link 
                        href={`/candidates/${candidate.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-primary-600"
                      >
                        {candidate.name}
                      </Link>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <FiBriefcase className="h-3 w-3 mr-1" />
                        {getJobTitle(candidate.jobId)}
                      </div>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${candidate.interview.type === 'Technical' ? 'bg-blue-100 text-blue-800' : candidate.interview.type === 'Behavioral' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`}>
                          {candidate.interview.type} Interview
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                      {statusText}
                    </span>
                    <div className="flex items-center text-xs text-gray-700 mt-2">
                      <FiCalendar className="mr-1 h-3 w-3" />
                      {formatInterviewDate(candidate.interview.date)}
                    </div>
                    <div className="flex items-center text-xs text-gray-700 mt-1">
                      <FiClock className="mr-1 h-3 w-3" />
                      {formatTime(candidate.interview.time)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      {candidate.interview.location.includes('Virtual') || candidate.interview.location.includes('Zoom') ? (
                        <>
                          <FiVideo className="mr-1 h-3 w-3" />
                          Virtual
                        </>
                      ) : (
                        <>
                          <FiMapPin className="mr-1 h-3 w-3" />
                          {candidate.interview.location}
                        </>
                      )}
                      {candidate.interview.interviewers && candidate.interview.interviewers.length > 0 && (
                        <span className="ml-2 flex items-center">
                          <FiUsers className="mr-1 h-3 w-3" />
                          {candidate.interview.interviewers.length} interviewer{candidate.interview.interviewers.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="px-6 py-4 border-t border-gray-200">
        <Link
          href="/interviews"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View all interviews
        </Link>
      </div>
    </div>
  );
} 