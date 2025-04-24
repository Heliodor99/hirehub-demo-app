'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded credentials
    const validEmail = 'admin@hirehub.com';
    const validPassword = 'password123';

    if (email === validEmail && password === validPassword) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel - Decorative */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 items-center justify-center p-12">
        <div className="max-w-md backdrop-blur-sm bg-white/10 p-10 rounded-2xl border border-white/20 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-6">Your Autopilot for Hiring</h1>
          <p className="text-white/90 text-lg mb-8">
            Streamline your recruitment process with AI-powered candidate matching, 
            intelligent assessments, and comprehensive analytics.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-white font-semibold mb-2">AI Matching</p>
              <p className="text-white/80 text-sm">Find the right candidates faster with intelligent matching algorithms</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-white font-semibold mb-2">Smart Analytics</p>
              <p className="text-white/80 text-sm">Make data-driven decisions with comprehensive recruitment insights</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-white font-semibold mb-2">Time Saving</p>
              <p className="text-white/80 text-sm">Reduce time-to-hire with automated workflows and assessments</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-white font-semibold mb-2">Easy Integration</p>
              <p className="text-white/80 text-sm">Seamlessly connects with your existing HR tools and systems</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-sm space-y-6 backdrop-blur-sm bg-white p-8 rounded-2xl border border-gray-100 shadow-lg">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image 
                src="/images/THH_Logo.png" 
                alt="HireHub Logo" 
                width={150} 
                height={50} 
                priority 
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to your account</p>
          </div>
          
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label htmlFor="email-address" className="block text-xs font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-700 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-700 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs p-2 rounded-xl">{error}</div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3 w-3 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-xs">
                <a href="#" className="font-medium text-primary-500 hover:text-accent-500 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-secondary-500 hover:to-accent-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-xs text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-all"
                onClick={() => router.push('/dashboard')}
              >
                Request a Demo
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            By signing in, you agree to our <a href="#" className="text-primary-500">Terms</a> and <a href="#" className="text-primary-500">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
} 