'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiSearch, FiBriefcase, FiMapPin, FiUsers, FiCalendar } from 'react-icons/fi';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';

const GET_JOBS_WITH_CANDIDATE_COUNT = gql`
  query GetJobsWithCandidateCount {
    jobs {
      id
      title
      company
      location
      department
      posted_date
      status
      description
      candidates_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  department: string;
  status: string;
  posted_date: string;
  description: string;
  candidates_aggregate?: {
    aggregate: {
      count: number;
    };
  };
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSeniorFrontendJob, setShowSeniorFrontendJob] = useState(false);
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_JOBS_WITH_CANDIDATE_COUNT);
  const jobs: Job[] = data?.jobs || [];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const show = localStorage.getItem('showSeniorFrontendJob');
      setShowSeniorFrontendJob(show === 'true');
    }
  }, []);

  console.log('JobsPage Apollo Query:', { loading, error, data });

  if (loading) return <div className="p-6">Loading jobs from Hasura...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading jobs: {error.message}</div>;

  const filteredJobs = jobs
    .filter((job: Job) =>
      job.title !== 'Senior Frontend Developer' || showSeniorFrontendJob
    )
    .filter((job: Job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleRowClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const JobList: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
    return (
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-gray-500">{job.location}</p>
                <p className="text-gray-500">{job.department}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Posted: {new Date(job.posted_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Candidates: {job.candidates_aggregate?.aggregate.count || 0}
                </p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {job.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary-600">Jobs</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all your job postings
            </p>
          </div>
          <Link
            href="/jobs/new"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-colors"
          >
            <FiPlus className="h-4 w-4" />
            Post New Job
          </Link>
        </div>

        <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white/90 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidates
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/80 divide-y divide-gray-200">
                {filteredJobs.map((job: Job) => (
                  <tr 
                    key={job.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(job.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-sm">
                          <FiBriefcase className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors">
                            {job.title}
                          </div>
                          <div className="text-xs text-gray-500">{job.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-secondary-500 mr-2"></span>
                        {job.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FiMapPin className="mr-2 h-3 w-3 text-accent-500" />
                        {job.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FiCalendar className="mr-2 h-3 w-3 text-secondary-500" />
                        {new Date(job.posted_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full border ${
                        job.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                        job.status === 'Draft' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FiUsers className="mr-2 h-3 w-3 text-primary-500" />
                        <div className="flex items-center justify-center h-8 w-8 text-xs font-medium rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                          {job.candidates_aggregate?.aggregate.count || 0}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No jobs found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 