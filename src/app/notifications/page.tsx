'use client';

import { useState } from 'react';
import { FiBell, FiCheck, FiX, FiUser, FiBriefcase, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { Notification } from '@/types';

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'application',
    title: 'New Application Received',
    message: 'Sarah Johnson applied for Senior Software Engineer position',
    time: '2 hours ago',
    read: false,
    icon: <FiUser className="h-5 w-5 text-blue-500" />,
  },
  {
    id: '2',
    type: 'interview',
    title: 'Interview Scheduled',
    message: 'Technical interview with Michael Chen scheduled for tomorrow at 2:30 PM',
    time: '5 hours ago',
    read: false,
    icon: <FiCalendar className="h-5 w-5 text-green-500" />,
  },
  {
    id: '3',
    type: 'job',
    title: 'Job Posted',
    message: 'New job posting for Product Manager has been published',
    time: '1 day ago',
    read: true,
    icon: <FiBriefcase className="h-5 w-5 text-purple-500" />,
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from the hiring team',
    time: '2 days ago',
    read: true,
    icon: <FiMessageSquare className="h-5 w-5 text-yellow-500" />,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'application' | 'interview' | 'job' | 'message'>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-1 text-sm text-gray-500">
              Stay updated with your hiring activities
            </p>
          </div>
          <div className="flex items-center">
            <FiBell className="h-6 w-6 text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">
              {notifications.filter(n => !n.read).length} unread
            </span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="application">Applications</option>
              <option value="interview">Interviews</option>
              <option value="job">Jobs</option>
              <option value="message">Messages</option>
            </select>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {notification.icon}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <FiCheck className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 