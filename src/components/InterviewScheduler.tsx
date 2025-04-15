import { useState } from 'react';
import { format, addDays } from 'date-fns';

interface InterviewSchedulerProps {
  candidateId: string;
  candidateName: string;
  onSchedule: (interview: InterviewDetails) => void;
}

interface InterviewDetails {
  date: string;
  time: string;
  type: 'phone' | 'video' | 'in-person';
  interviewers: string[];
  notes: string;
}

export default function InterviewScheduler() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Schedule Interview</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option>09:00</option>
            <option>09:30</option>
            <option>10:00</option>
            <option>10:30</option>
            <option>11:00</option>
            <option>11:30</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Interview Type</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option>Phone</option>
            <option>Video</option>
            <option>In-person</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Interviewers</label>
          <input
            type="text"
            placeholder="Enter interviewer emails"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add any additional notes or instructions..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Schedule Interview
          </button>
        </div>
      </form>
    </div>
  );
} 