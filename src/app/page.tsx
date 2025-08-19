'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { FirebaseDashboard } from '@/components/dashboard/FirebaseDashboard';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState('/');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/customers':
        return 'Customers';
      case '/jobs':
        return 'Jobs';
      case '/estimates':
        return 'Estimates';
      case '/invoices':
        return 'Invoices';
      case '/projects':
        return 'Projects';
      case '/locations':
        return 'Locations';
      case '/timesheets':
        return 'Timesheets';
      default:
        return 'Dashboard';
    }
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return <Dashboard />;
      case '/customers':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Customers</h2>
            <p className="text-gray-500 mt-2">Customer management coming soon...</p>
          </div>
        );
      case '/jobs':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Jobs</h2>
            <p className="text-gray-500 mt-2">Job management coming soon...</p>
          </div>
        );
      case '/estimates':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Estimates</h2>
            <p className="text-gray-500 mt-2">Estimate management coming soon...</p>
          </div>
        );
      case '/invoices':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Invoices</h2>
            <p className="text-gray-500 mt-2">Invoice management coming soon...</p>
          </div>
        );
      case '/projects':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
            <p className="text-gray-500 mt-2">Project management coming soon...</p>
          </div>
        );
      case '/locations':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Locations</h2>
            <p className="text-gray-500 mt-2">Location management coming soon...</p>
          </div>
        );
      case '/timesheets':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Timesheets</h2>
            <p className="text-gray-500 mt-2">Timesheet management coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed inset-y-0 z-50 lg:static lg:inset-0`}>
        <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={getPageTitle(currentPath)} 
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
