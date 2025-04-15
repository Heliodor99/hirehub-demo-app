'use client';

import { useState } from 'react';
import { FiSave, FiEdit2, FiBuilding, FiMapPin, FiGlobe, FiUsers, FiMail } from 'react-icons/fi';

const initialCompanyInfo = {
  name: 'TechSolutions Inc.',
  industry: 'Technology',
  size: '100-500',
  location: 'San Francisco, CA',
  website: 'https://techsolutions.com',
  description: 'A leading technology company specializing in innovative software solutions.',
  contactEmail: 'hr@techsolutions.com',
  foundedYear: '2015',
};

export default function SettingsPage() {
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your company information and preferences
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiEdit2 className="mr-2 h-4 w-4" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={companyInfo.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                    Industry
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="industry"
                      id="industry"
                      value={companyInfo.industry}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                    Company Size
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="size"
                      id="size"
                      value={companyInfo.size}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={companyInfo.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="website"
                    id="website"
                    value={companyInfo.website}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Company Description
                </label>
                <div className="mt-1">
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={companyInfo.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Contact Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="contactEmail"
                      id="contactEmail"
                      value={companyInfo.contactEmail}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
                    Founded Year
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="foundedYear"
                      id="foundedYear"
                      value={companyInfo.foundedYear}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FiSave className="mr-2 h-4 w-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 