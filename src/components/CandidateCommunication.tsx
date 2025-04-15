import { useState } from 'react';

interface Message {
  id: string;
  sender: 'recruiter' | 'candidate';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface CandidateCommunicationProps {
  candidateId: string;
  candidateName: string;
  onSendMessage: (message: string) => void;
}

export default function CandidateCommunication() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {/* Recruiter Message */}
        <div className="flex justify-end">
          <div className="max-w-[70%] rounded-lg p-3 bg-blue-100 text-blue-900">
            <p className="text-sm">Thank you for applying to the UI/UX Designer position. We would like to schedule an initial interview.</p>
            <p className="text-xs text-gray-500 mt-1">10:30 AM • ✓✓✓</p>
          </div>
        </div>

        {/* Candidate Message */}
        <div className="flex justify-start">
          <div className="max-w-[70%] rounded-lg p-3 bg-gray-100 text-gray-900">
            <p className="text-sm">Thank you for reaching out. I would be happy to schedule an interview.</p>
            <p className="text-xs text-gray-500 mt-1">11:45 AM</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 