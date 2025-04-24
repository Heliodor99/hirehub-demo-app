import React from 'react';
import { FiMail, FiPhone, FiCalendar, FiCheckCircle, FiUsers, FiClock, FiFileText, FiVideo } from 'react-icons/fi';

interface Attachment {
  name: string;
  size: string;
}

interface EventMetadata {
  duration?: string;
  score?: number;
  meetLink?: string;
}

interface CommunicationEvent {
  id: string;
  date: string;
  time: string;
  type: 'email' | 'phone' | 'calendar' | 'assessment' | 'interview' | 'system';
  channel: string;
  subject: string;
  content: string;
  direction: 'inbound' | 'outbound' | 'system';
  attachments?: Attachment[];
  metadata?: EventMetadata;
}

interface CommunicationTimelineProps {
  events: CommunicationEvent[];
}

const CommunicationTimeline: React.FC<CommunicationTimelineProps> = ({ events }) => {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {events.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 && (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    event.direction === 'inbound' 
                      ? 'bg-blue-100' 
                      : event.direction === 'outbound'
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    {event.type === 'email' && <FiMail className="h-5 w-5 text-gray-600" />}
                    {event.type === 'phone' && <FiPhone className="h-5 w-5 text-gray-600" />}
                    {event.type === 'calendar' && <FiCalendar className="h-5 w-5 text-gray-600" />}
                    {event.type === 'assessment' && <FiCheckCircle className="h-5 w-5 text-gray-600" />}
                    {event.type === 'interview' && <FiUsers className="h-5 w-5 text-gray-600" />}
                    {event.type === 'system' && <FiClock className="h-5 w-5 text-gray-600" />}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">
                        {event.subject}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {event.date} at {event.time} via {event.channel}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p className="whitespace-pre-line">{event.content}</p>
                  </div>
                  {event.attachments && event.attachments.length > 0 && (
                    <div className="mt-2">
                      <div className="flex space-x-2">
                        {event.attachments.map((attachment, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            <FiFileText className="mr-1 h-4 w-4" />
                            {attachment.name} ({attachment.size})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {event.metadata && (
                    <div className="mt-2 text-sm">
                      {event.metadata.duration && (
                        <span className="inline-flex items-center mr-3 text-gray-500">
                          <FiClock className="mr-1 h-4 w-4" />
                          Duration: {event.metadata.duration}
                        </span>
                      )}
                      {event.metadata.score && (
                        <span className="inline-flex items-center mr-3 text-gray-500">
                          <FiCheckCircle className="mr-1 h-4 w-4" />
                          Score: {event.metadata.score}%
                        </span>
                      )}
                      {event.metadata.meetLink && (
                        <a
                          href={event.metadata.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary-600 hover:text-primary-700"
                        >
                          <FiVideo className="mr-1 h-4 w-4" />
                          Join Meeting
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 self-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { CommunicationTimeline }; 