import React, { useState } from 'react';
import { 
  FiChevronDown, 
  FiChevronUp,
  FiPaperclip,
  FiDownload,
  FiLink,
  FiVideo,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';
import EventIcon from './EventIcon';

export interface Attachment {
  name: string;
  size: string;
  url?: string;
  type: string;
}

export interface EventMetadata {
  duration?: string;
  score?: number;
  meetLink?: string;
  attendees?: string[];
  location?: string;
  statusUpdate?: string;
  tags?: string[];
  interviewDetails?: {
    date?: string;
    time?: string;
    type?: string;
    location?: string;
    duration?: string;
    interviewer?: string;
  };
  questions?: number;
  speaker?: {
    question?: string;
    answer?: string;
  };
  outcome?: string;
  interviewFeedback?: {
    interviewer?: string;
    decision?: string;
  };
  source?: string;
  applicationId?: string;
}

export interface CommunicationEvent {
  id: string;
  date: string;
  time: string;
  type: 'email' | 'phone' | 'calendar' | 'assessment' | 'interview' | 'system' | 'message' | 'note' | 'document';
  channel: string;
  subject: string;
  content: string;
  direction: 'inbound' | 'outbound' | 'system';
  status?: 'sent' | 'read' | 'pending' | 'scheduled' | 'completed' | 'failed' | 'delivered';
  sender?: string;
  recipient?: string;
  attachments?: Attachment[];
  metadata?: EventMetadata;
  relatedEvents?: string[]; // IDs of related communication events
}

export interface CommunicationTimelineProps {
  events: CommunicationEvent[];
  onEventClick?: (event: CommunicationEvent) => void;
  onReply?: (event: CommunicationEvent) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const CommunicationTimeline: React.FC<CommunicationTimelineProps> = ({ 
  events,
  onEventClick,
  onReply
}) => {
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  
  // Sort events by date (oldest first)
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const toggleEventExpand = (id: string) => {
    setExpandedEvents(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Group events by date
  const groupedEvents: Record<string, CommunicationEvent[]> = {};
  sortedEvents.forEach(event => {
    const formattedDate = formatDate(event.date);
    if (!groupedEvents[formattedDate]) {
      groupedEvents[formattedDate] = [];
    }
    groupedEvents[formattedDate].push(event);
  });

  // Get dates in chronological order
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  return (
    <div className="space-y-4">
      {sortedDates.length > 0 ? (
        sortedDates.map((date) => (
          <div key={date} className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-start">
                <span className="px-2 bg-white text-xs font-medium text-gray-500">
                  {date}
                </span>
              </div>
            </div>

            <ul role="list" className="space-y-2">
              {groupedEvents[date].map((event) => {
                const isExpanded = expandedEvents[event.id] || false;
                const isWhatsApp = event.channel === 'WhatsApp';
                
                return (
                  <li 
                    key={event.id} 
                    className={`bg-white rounded-md border ${
                      isWhatsApp ? 'border-green-200 shadow-sm hover:shadow-sm' : 'border-gray-200 shadow-sm hover:shadow-sm'
                    } transition-shadow`}
                  >
                    <div 
                      className="p-3 cursor-pointer"
                      onClick={() => {
                        toggleEventExpand(event.id);
                        if (onEventClick) onEventClick(event);
                      }}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center ${
                            isWhatsApp ? 'bg-green-100' :
                            event.direction === 'inbound' 
                              ? 'bg-blue-100' 
                              : event.direction === 'outbound'
                              ? 'bg-green-100'
                              : 'bg-gray-100'
                          }`}>
                            <EventIcon type={event.type} channel={event.channel} />
                          </div>
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="text-xs font-medium text-gray-900 truncate flex items-center">
                              {event.subject}
                              {isWhatsApp && (
                                <span className="ml-1 text-xs font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                                  WhatsApp
                                </span>
                              )}
                            </h3>
                            <div className="flex-shrink-0 flex">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                isWhatsApp ? 'bg-green-100 text-green-800' :
                                event.direction === 'inbound' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : event.direction === 'outbound'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {event.direction === 'inbound' ? 'Received' : event.direction === 'outbound' ? 'Sent' : 'System'}
                              </span>
                              <button 
                                className="ml-1 text-gray-400 hover:text-gray-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleEventExpand(event.id);
                                }}
                              >
                                {isExpanded ? 
                                  <FiChevronUp className="h-4 w-4" /> : 
                                  <FiChevronDown className="h-4 w-4" />
                                }
                              </button>
                            </div>
                          </div>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {event.time} via {event.channel}
                            {event.sender && event.recipient && (
                              <> • {event.sender} → {event.recipient}</>
                            )}
                          </p>
                          {isExpanded && (
                            <div className={`mt-2 text-xs ${isWhatsApp ? 'p-2 bg-green-50 rounded-lg' : ''}`}>
                              <p className="whitespace-pre-line text-gray-700">{event.content}</p>
                              
                              {/* Attachments */}
                              {event.attachments && event.attachments.length > 0 && (
                                <div className="mt-3 space-y-1">
                                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Attachments
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {event.attachments.map((attachment, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-xs"
                                      >
                                        <FiPaperclip className="mr-1 h-3 w-3 text-gray-500" />
                                        <span className="mr-1 text-gray-700">{attachment.name}</span>
                                        <span className="text-gray-500 text-xs">({attachment.size})</span>
                                        {attachment.url && (
                                          <a 
                                            href={attachment.url} 
                                            className="ml-1 text-primary-600 hover:text-primary-700"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <FiDownload className="h-3 w-3" />
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Metadata */}
                              {event.metadata && Object.keys(event.metadata).length > 0 && (
                                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-500">
                                  {event.metadata.duration && (
                                    <div className="col-span-1 flex items-center">
                                      <FiClock className="mr-1 h-3 w-3 text-gray-400" />
                                      <span>Duration: {event.metadata.duration}</span>
                                    </div>
                                  )}
                                  {event.metadata.score !== undefined && (
                                    <div className="col-span-1 flex items-center">
                                      <FiCheckCircle className="mr-1 h-3 w-3 text-gray-400" />
                                      <span>Score: {event.metadata.score}%</span>
                                    </div>
                                  )}
                                  {event.metadata.location && (
                                    <div className="col-span-1 flex items-center">
                                      <FiLink className="mr-1 h-3 w-3 text-gray-400" />
                                      <span>Location: {event.metadata.location}</span>
                                    </div>
                                  )}
                                  {event.metadata.meetLink && (
                                    <div className="col-span-1 flex items-center">
                                      <a
                                        href={event.metadata.meetLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-primary-600 hover:text-primary-700"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <FiVideo className="mr-1 h-3 w-3" />
                                        Join Meeting
                                      </a>
                                    </div>
                                  )}
                                  {event.metadata.tags && event.metadata.tags.length > 0 && (
                                    <div className="col-span-2 flex items-center flex-wrap gap-1 mt-1">
                                      {event.metadata.tags.map((tag, idx) => (
                                        <span 
                                          key={idx}
                                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Action buttons */}
                              {(event.type === 'email' || event.type === 'message') && onReply && (
                                <div className="mt-3 flex justify-end">
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onReply(event);
                                    }}
                                  >
                                    Reply
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-xs text-gray-500">No communication history found</p>
        </div>
      )}
    </div>
  );
}; 