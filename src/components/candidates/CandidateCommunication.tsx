'use client';

import { FiMail, FiMessageCircle, FiClock, FiFileText, FiUser } from 'react-icons/fi';
import { Candidate } from '@/types';

interface CandidateCommunicationProps {
  candidate: Candidate;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function CandidateCommunication({ candidate }: CandidateCommunicationProps) {
  return (
    <div className="space-y-6">
      {/* Communication Summary */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Communication Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiMail className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Emails</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{candidate.communication?.emails?.length || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiMessageCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Messages</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{candidate.communication?.messages?.length || 0}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiClock className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Last Contact</span>
            </div>
            <p className="mt-2 text-sm text-gray-900">
              {candidate.communication?.lastContact ? formatDate(candidate.communication.lastContact) : 'No recent contact'}
            </p>
          </div>
        </div>
      </div>

      {/* Email Threads */}
      {candidate.communication?.emails && candidate.communication.emails.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Email Communication</h2>
          <div className="space-y-6">
            {candidate.communication.emails
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((email: {
                id: string;
                subject: string;
                date: string;
                from: string;
                to: string;
                body: string;
                attachments?: string[];
              }, index: number) => (
                <div key={email.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{email.subject}</h3>
                      <div className="mt-1 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiMail className="mr-1.5 h-4 w-4" />
                          <span>From: {email.from}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <FiMail className="mr-1.5 h-4 w-4" />
                          <span>To: {email.to}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiClock className="mr-1.5 h-4 w-4" />
                        <span>{formatDate(email.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{email.body}</p>
                  </div>
                  {email.attachments && email.attachments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center">
                        <FiFileText className="mr-1.5 h-4 w-4" />
                        Attachments:
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {email.attachments.map((attachment, i) => (
                          <li key={i} className="flex items-center">
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                              <FiFileText className="mr-1.5 h-4 w-4" />
                              {attachment}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {candidate.communication?.messages && candidate.communication.messages.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Messages</h2>
          <div className="space-y-4">
            {candidate.communication.messages
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((message: {
                id: string;
                date: string;
                sender: string;
                content: string;
                type: 'incoming' | 'outgoing';
              }, index: number) => (
                <div key={message.id} className={`flex ${message.type === 'incoming' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'incoming' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-primary-100 text-primary-900'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        {message.type === 'incoming' ? (
                          <FiUser className="mr-1.5 h-4 w-4 text-gray-500" />
                        ) : (
                          <FiUser className="mr-1.5 h-4 w-4 text-primary-500" />
                        )}
                        <span className="text-xs font-medium">
                          {message.type === 'incoming' ? message.sender : 'You'}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <FiClock className="mr-1.5 h-3 w-3" />
                        <span>{formatDate(message.date)}</span>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
} 