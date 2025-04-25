'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

// Brand colors
const BRAND = {
  blue: '#2B7BD3',
  teal: '#2ECDC3',
  purple: '#9B5CFF'
};

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Jobs', href: '/jobs', icon: FiBriefcase },
  { name: 'Candidates', href: '/candidates', icon: FiUsers },
  { name: 'Interviews', href: '/interviews', icon: FiCalendar },
  { name: 'Reports and Analytics', href: '/reports-analytics', icon: FiBarChart2 },
  { name: 'Settings', href: '/settings', icon: FiSettings },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">
          <span 
            className="bg-gradient-to-r bg-clip-text text-transparent" 
            style={{ 
              backgroundImage: `linear-gradient(to right, ${BRAND.blue}, ${BRAND.teal}, ${BRAND.purple})` 
            }}
          >
            HireHub AI
          </span>
        </h1>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
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
      
      {/* Logout button at bottom of sidebar */}
      <div className="px-2 py-4 border-t border-gray-200">
        <button className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
          <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
          Logout
        </button>
      </div>
    </div>
  );
} 