'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiHome, 
  FiBriefcase, 
  FiUsers, 
  FiBarChart2, 
  FiSettings, 
  FiUser,
  FiCalendar,
  FiPieChart,
  FiLogOut
} from 'react-icons/fi';
import { Avatar } from './DesignSystem';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Jobs', href: '/jobs', icon: FiBriefcase },
  { name: 'Candidates', href: '/candidates', icon: FiUsers },
  { name: 'Interviews', href: '/interviews', icon: FiCalendar },
  { name: 'Analytics', href: '/analytics', icon: FiPieChart },
  { name: 'Reports', href: '/reports', icon: FiBarChart2 },
  { name: 'Settings', href: '/settings', icon: FiSettings },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Here you would normally clear authentication state
    // For now, just redirect to the login page
    router.push('/');
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200/50 w-64 shadow-card">
      <div className="flex items-center h-16 px-6 border-b border-gray-200/50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 via-teal-500 to-purple-500 text-transparent bg-clip-text">HireHub AI</h1>
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-primary-600' : 'text-gray-400'
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200/50 mx-2 my-2 rounded-lg bg-gray-50/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar 
              size="sm" 
              initials="AU" 
              className="bg-primary-100 text-primary-700"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">admin@hirehub.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Logout"
          >
            <FiLogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 