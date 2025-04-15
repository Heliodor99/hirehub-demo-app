'use client';

import { useState } from 'react';
import { FiHelpCircle, FiMail, FiMessageSquare, FiBook, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FAQ {
  question: string;
  answer: string;
}

interface SupportChannel {
  name: string;
  description: string;
  icon: React.ReactNode;
  contact: string;
}

const faqs: FAQ[] = [
  {
    question: 'How do I post a new job?',
    answer: 'To post a new job, go to the Jobs page and click the "Post New Job" button. Fill in the required information and submit the form.',
  },
  {
    question: 'How does the AI assessment work?',
    answer: 'Our AI assessment analyzes candidate responses and provides insights on their technical skills, communication abilities, and cultural fit.',
  },
  {
    question: 'Can I customize the interview process?',
    answer: 'Yes, you can customize the interview process by creating different stages and assigning specific interviewers to each stage.',
  },
  {
    question: 'How do I schedule interviews?',
    answer: 'You can schedule interviews through the Interviews page. Select a candidate, choose a date and time, and add interviewers.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take data security seriously. All your data is encrypted and stored securely in compliance with industry standards.',
  },
];

const supportChannels: SupportChannel[] = [
  {
    name: 'Email Support',
    description: 'Get help via email',
    icon: <FiMail className="h-6 w-6 text-blue-500" />,
    contact: 'support@hirehub.com',
  },
  {
    name: 'Live Chat',
    description: 'Chat with our support team',
    icon: <FiMessageSquare className="h-6 w-6 text-green-500" />,
    contact: 'Available 9AM-5PM EST',
  },
  {
    name: 'Documentation',
    description: 'Browse our help center',
    icon: <FiBook className="h-6 w-6 text-purple-500" />,
    contact: 'docs.hirehub.com',
  },
];

export default function HelpPage() {
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);

  const toggleFaq = (index: number) => {
    setOpenFaqs(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <FiHelpCircle className="h-12 w-12 text-primary-500 mx-auto" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="mt-2 text-lg text-gray-500">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white shadow rounded-lg">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-4 py-4 text-left focus:outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {faq.question}
                      </h3>
                      {openFaqs.includes(index) ? (
                        <FiChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FiChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  {openFaqs.includes(index) && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-500">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Support Channels</h2>
            <div className="space-y-4">
              {supportChannels.map((channel, index) => (
                <div
                  key={index}
                  className="bg-white shadow rounded-lg p-6 flex items-start"
                >
                  <div className="flex-shrink-0">
                    {channel.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {channel.name}
                    </h3>
                    <p className="mt-1 text-gray-500">{channel.description}</p>
                    <p className="mt-2 text-sm text-primary-600">{channel.contact}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Submit a Support Ticket
              </h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Submit Ticket
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 