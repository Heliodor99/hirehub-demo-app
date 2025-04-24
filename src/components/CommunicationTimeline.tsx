import React, { useState } from 'react';
import { FiMail, FiPhone, FiCalendar, FiCheckCircle, FiUsers, FiClock, FiFileText, FiVideo, FiMessageSquare, FiLinkedin, FiChevronDown, FiChevronRight } from 'react-icons/fi';

interface Attachment {
  name: string;
  size: string;
  type?: string;
}

interface EventMetadata {
  duration?: string;
  score?: number;
  meetLink?: string;
  approvedBy?: string;
  requestedBy?: string;
  overallImpression?: string;
  technicalScore?: number;
  culturalFitScore?: number;
  interviewers?: string[];
  outcome?: string;
  attendees?: string[];
  completedSections?: string[];
  [key: string]: any;
}

interface CommunicationEvent {
  id: string;
  date: string;
  time: string;
  type: 'email' | 'phone' | 'calendar' | 'assessment' | 'interview' | 'system' | 'whatsapp' | 'linkedin';
  channel: string;
  subject: string;
  content: string;
  direction: 'inbound' | 'outbound' | 'system';
  status?: string;
  sender?: string;
  recipient?: string;
  attachments?: Attachment[];
  metadata?: EventMetadata;
}

interface CommunicationTimelineProps {
  events: CommunicationEvent[];
}

const getIconByType = (type: string) => {
  switch (type) {
    case 'email':
      return <FiMail className="h-5 w-5 text-gray-600" />;
    case 'phone':
      return <FiPhone className="h-5 w-5 text-gray-600" />;
    case 'calendar':
      return <FiCalendar className="h-5 w-5 text-gray-600" />;
    case 'assessment':
      return <FiCheckCircle className="h-5 w-5 text-gray-600" />;
    case 'interview':
      return <FiUsers className="h-5 w-5 text-gray-600" />;
    case 'system':
      return <FiClock className="h-5 w-5 text-gray-600" />;
    case 'whatsapp':
      return <FiMessageSquare className="h-5 w-5 text-gray-600" />;
    case 'linkedin':
      return <FiLinkedin className="h-5 w-5 text-gray-600" />;
    default:
      return <FiMail className="h-5 w-5 text-gray-600" />;
  }
};

const getIconBackgroundColor = (type: string, direction: string) => {
  // Base colors by message direction
  const baseColors = {
    inbound: 'bg-blue-100',
    outbound: 'bg-green-100',
    system: 'bg-gray-100'
  };

  // Special colors by type
  switch (type) {
    case 'email':
      return direction === 'inbound' ? 'bg-blue-100' : direction === 'outbound' ? 'bg-green-100' : 'bg-gray-100';
    case 'phone':
      return 'bg-yellow-100';
    case 'calendar':
      return 'bg-purple-100';
    case 'assessment':
      return 'bg-teal-100';
    case 'interview':
      return 'bg-indigo-100';
    case 'whatsapp':
      return 'bg-emerald-100';
    case 'linkedin':
      return 'bg-sky-100';
    default:
      return baseColors[direction as keyof typeof baseColors];
  }
};

const getTimelineBarColor = (index: number, totalEvents: number) => {
  // Different colors based on progress through the timeline
  const colors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200', 'bg-indigo-200'];
  const colorIndex = Math.floor((index / totalEvents) * colors.length);
  return colors[colorIndex] || 'bg-gray-200';
};

const formatMetadataValue = (key: string, value: any) => {
  if (key === 'score' || key === 'technicalScore' || key === 'culturalFitScore') {
    return `${value}%`;
  }
  return typeof value === 'object' ? JSON.stringify(value) : value.toString();
};

// Event component to handle individual event display
const TimelineEvent: React.FC<{ event: CommunicationEvent }> = ({ event }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Extract a short preview of the content
  const contentPreview = event.content.split('\n')[0]?.slice(0, 60) + (event.content.length > 60 ? '...' : '');
  
  return (
    <div className="min-w-0 flex-1 bg-white rounded-lg border border-gray-100 shadow-sm p-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium text-gray-900">{event.subject}</span>
        </div>
        <div className="flex-shrink-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            event.direction === 'inbound' 
              ? 'bg-blue-100 text-blue-800' 
              : event.direction === 'outbound'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {event.direction === 'inbound' ? 'Received' : event.direction === 'outbound' ? 'Sent' : 'System'}
          </span>
        </div>
      </div>
      
      <p className="mt-0.5 text-sm text-gray-500">
        {event.date} at {event.time} via {event.channel}
        {!expanded && event.sender && event.recipient && (
          <span className="ml-1">
            • {event.direction === 'inbound' ? `From: ${event.sender.split('@')[0]}` : `To: ${event.recipient.split('@')[0]}`}
          </span>
        )}
      </p>
      
      {/* Collapsed view */}
      {!expanded && (
        <div className="mt-1 text-sm text-gray-700 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(true)}>
          <p className="text-sm text-gray-600">{contentPreview}</p>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
          >
            <FiChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Expanded view */}
      {expanded && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-gray-500">Details</div>
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setExpanded(false)}
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          {event.sender && event.recipient && (
            <div className="text-xs text-gray-500 mb-2">
              <span className="font-medium">From:</span> {event.sender}<br />
              <span className="font-medium">To:</span> {event.recipient}
            </div>
          )}
          
          <div className="text-sm text-gray-700 mb-3">
            <p className="whitespace-pre-line">{event.content}</p>
          </div>
          
          {event.attachments && event.attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {event.attachments.map((attachment, index) => (
                <div 
                  key={index}
                  className="flex items-center p-2 rounded bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <FiFileText className="h-4 w-4 text-gray-500 mr-2" />
                  <div>
                    <p className="text-xs font-medium text-gray-700">{attachment.name}</p>
                    <p className="text-xs text-gray-500">{attachment.size}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {event.metadata && Object.keys(event.metadata).length > 0 && (
            <div className="mt-2 bg-gray-50 p-2 rounded-md">
              <div className="text-xs font-medium text-gray-500 mb-1">Additional Details</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(event.metadata)
                  .filter(([key, value]) => value !== undefined && key !== 'meetLink')
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <span className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="ml-1 text-xs font-medium text-gray-700">
                        {Array.isArray(value) 
                          ? value.slice(0, 3).join(', ') + (value.length > 3 ? '...' : '')
                          : formatMetadataValue(key, value)
                        }
                      </span>
                    </div>
                  ))}
              </div>
              {event.metadata.meetLink && (
                <div className="mt-2">
                  <a
                    href={event.metadata.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors"
                  >
                    <FiVideo className="mr-1 h-3 w-3" />
                    Join Meeting
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CommunicationTimeline: React.FC<CommunicationTimelineProps> = ({ events }) => {
  const sortedEvents = [...events].sort((a, b) => {
    // Sort by date and time
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {sortedEvents.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-6">
              {eventIdx !== sortedEvents.length - 1 && (
                <span
                  className={`absolute left-5 top-5 -ml-px h-full w-0.5 ${getTimelineBarColor(eventIdx, sortedEvents.length)}`}
                  aria-hidden="true"
                />
              )}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getIconBackgroundColor(event.type, event.direction)}`}>
                    {getIconByType(event.type)}
                  </div>
                </div>
                <TimelineEvent event={event} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { CommunicationTimeline }; 