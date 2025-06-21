'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartBar, FaUsers, FaBuilding, FaChartLine, FaCog } from 'react-icons/fa';

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: <FaChartBar className="h-5 w-5" />
    },
    {
      href: '/admin/users',
      label: 'Users',
      icon: <FaUsers className="h-5 w-5" />
    },
    {
      href: '/admin/businesses',
      label: 'Businesses',
      icon: <FaBuilding className="h-5 w-5" />
    },
    {
      href: '/admin/analytics',
      label: 'Analytics',
      icon: <FaChartLine className="h-5 w-5" />
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: <FaCog className="h-5 w-5" />
    }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 