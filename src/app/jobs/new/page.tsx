'use client';

import { useState } from 'react';
import { FiUploadCloud, FiEdit3, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

// Using the Senior Frontend Developer job as predefined data
const predefinedJobData = {
  title: 'Senior Frontend Developer',
  company: 'TechCorp India',
  location: 'Bangalore, Karnataka',
  department: 'Engineering',
  description: 'We are looking for an experienced Frontend Developer to join our team...',
  requirements: [
    '5+ years of experience in frontend development',
    'Strong proficiency in React and TypeScript',
    'Experience with modern frontend build tools',
    'Bachelor\'s degree in Computer Science or related field'
  ],
  responsibilities: [
    'Develop and maintain frontend applications',
    'Collaborate with design and backend teams',
    'Write clean, maintainable code',
    'Participate in code reviews'
  ],
  salary: '18-28 LPA',
  employmentType: 'Full-time',
  benefits: [
    'Health insurance',
    'Provident fund',
    'Flexible work hours',
    'Remote work options'
  ]
};

export default function NewJobPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'upload' | 'manual' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    department: '',
    description: '',
    requirements: '',
    responsibilities: '',
    salary: '',
    employmentType: '',
    benefits: ''
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setIsLoading(true);
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Set predefined data
    setFormData({
      title: predefinedJobData.title,
      company: predefinedJobData.company,
      location: predefinedJobData.location,
      department: predefinedJobData.department,
      description: predefinedJobData.description,
      requirements: predefinedJobData.requirements.join('\\n'),
      responsibilities: predefinedJobData.responsibilities.join('\\n'),
      salary: predefinedJobData.salary,
      employmentType: predefinedJobData.employmentType,
      benefits: predefinedJobData.benefits.join('\\n')
    });
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (typeof window !== 'undefined') {
      localStorage.setItem('showSeniorFrontendJob', 'true');
    }
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      router.push('/jobs');
    }, 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post New Job</h1>

      {!method ? (
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => setMethod('upload')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
          >
            <div className="flex flex-col items-center">
              <FiUploadCloud className="h-12 w-12 text-gray-400 group-hover:text-primary-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Job Description</h3>
              <p className="text-sm text-gray-500 text-center">
                Upload a file containing the job description
              </p>
            </div>
          </button>

          <button
            onClick={() => setMethod('manual')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
          >
            <div className="flex flex-col items-center">
              <FiEdit3 className="h-12 w-12 text-gray-400 group-hover:text-primary-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Fill Manually</h3>
              <p className="text-sm text-gray-500 text-center">
                Enter the job description details manually
              </p>
            </div>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {method === 'upload' && (
            <div className="mb-6">
              <label 
                className={`block p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                  dragActive 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-primary-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileInput}
                />
                <div className="flex flex-col items-center">
                  <FiUploadCloud className={`h-12 w-12 mb-4 ${
                    dragActive ? 'text-primary-500' : 'text-gray-400'
                  }`} />
                  <p className="text-sm text-gray-500">
                    {dragActive ? 'Drop your file here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, DOC, DOCX, TXT up to 10MB
                  </p>
                </div>
              </label>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 h-32"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements (one per line)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 h-32"
                value={formData.requirements}
                onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Enter each requirement on a new line"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsibilities (one per line)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 h-32"
                value={formData.responsibilities}
                onChange={e => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="Enter each responsibility on a new line"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary Range
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={formData.salary}
                onChange={e => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={formData.employmentType}
                onChange={e => setFormData({ ...formData, employmentType: e.target.value })}
              >
                <option value="">Select type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Benefits (one per line)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 h-32"
                value={formData.benefits}
                onChange={e => setFormData({ ...formData, benefits: e.target.value })}
                placeholder="Enter each benefit on a new line"
              />
            </div>

            <div className="col-span-2 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setMethod(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Save Job'
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Loading Overlay */}
      {isLoading && method === 'upload' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <FiLoader className="h-8 w-8 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-900 font-medium">Processing Job Description...</p>
            <p className="text-sm text-gray-500 mt-1">This will take a few seconds</p>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <FiCheck className="h-5 w-5" />
          Job description details have been saved successfully
        </div>
      )}
    </div>
  );
} 