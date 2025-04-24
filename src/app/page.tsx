'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button, Input, Card, CardBody } from '@/components/DesignSystem';
import { FiMail, FiLock } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Hardcoded credentials
      const validEmail = 'admin@hirehub.com';
      const validPassword = 'password123';

      if (email === validEmail && password === validPassword) {
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full backdrop-blur-sm bg-white/80 p-8 rounded-xl shadow-xl border border-white/50">
        <CardBody>
          <div className="flex flex-col items-center">
            <Image 
              src="/images/THH_Logo.png" 
              alt="HireHub Logo" 
              width={180} 
              height={60} 
              className="mx-auto"
              priority
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50/80 backdrop-blur-sm p-2 rounded-md">{error}</div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-purple-500 hover:text-purple-400">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
              >
                Sign in
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => router.push('/dashboard')}
              >
                Request a Demo
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/70 text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="tertiary"
                fullWidth
                onClick={() => router.push('/dashboard')}
              >
                Continue as Guest
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
} 