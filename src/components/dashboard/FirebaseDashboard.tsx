'use client';

import React, { useEffect, useState } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { StatsCard } from './StatsCard';
import { RecentActivity } from './RecentActivity';
import { AIAutomations } from './AIAutomations';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Receipt, 
  DollarSign,
  TrendingUp,
  RefreshCw,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';

export function FirebaseDashboard() {
  const {
    jobs,
    customers,
    estimates,
    invoices,
    isLoading,
    refreshData,
    enableRealTimeSync,
    setEnableRealTimeSync
  } = useFirebase();

  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 0,
    activeJobs: 0,
    pendingEstimates: 0,
    overdueInvoices: 0,
    monthlyRevenue: 0,
    completionRate: 87
  });

  // Calculate stats from Firebase data
  useEffect(() => {
    const activeJobs = jobs.filter(job => job.status === 'in_progress').length;
    const pendingEstimates = estimates.filter(est => est.status === 'sent').length;
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyRevenue = invoices
      .filter(inv => {
        const invoiceDate = new Date(inv.created_at);
        return invoiceDate.getMonth() === currentMonth && 
               invoiceDate.getFullYear() === currentYear &&
               inv.status === 'paid';
      })
      .reduce((sum, inv) => sum + inv.total_amount, 0);

    setDashboardStats({
      totalCustomers: customers.length,
      activeJobs,
      pendingEstimates,
      overdueInvoices,
      monthlyRevenue,
      completionRate: 87 // This could be calculated from job completion data
    });
  }, [jobs, customers, estimates, invoices]);

  // Generate recent activity from Firebase data
  const recentActivities = React.useMemo(() => {
    const activities: any[] = [];
    
    // Add recent jobs
    jobs.slice(0, 3).forEach(job => {
      activities.push({
        id: `job-${job.id}`,
        type: 'job',
        title: `Job: ${job.title}`,
        description: `Status updated to ${job.status.replace('_', ' ')}`,
        timestamp: job.updated_at || job.created_at,
        status: job.status
      });
    });

    // Add recent estimates
    estimates.slice(0, 2).forEach(estimate => {
      activities.push({
        id: `estimate-${estimate.id}`,
        type: 'estimate',
        title: `Estimate: ${estimate.title}`,
        description: `Status: ${estimate.status.replace('_', ' ')}`,
        timestamp: estimate.updated_at || estimate.created_at,
        status: estimate.status
      });
    });

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [jobs, estimates]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Database className="h-12 w-12 text-primary-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading data from Firebase...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Firebase Status Bar */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">Firebase Connected</p>
            <p className="text-sm text-blue-700">
              Real-time sync: {enableRealTimeSync ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEnableRealTimeSync(!enableRealTimeSync)}
            className="flex items-center gap-2"
          >
            {enableRealTimeSync ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {enableRealTimeSync ? 'Real-time ON' : 'Real-time OFF'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={refreshData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Customers"
          value={dashboardStats.totalCustomers}
          icon={Users}
          change={{ value: 12, type: 'increase' }}
        />
        <StatsCard
          title="Active Jobs"
          value={dashboardStats.activeJobs}
          icon={Briefcase}
          change={{ value: 8, type: 'increase' }}
        />
        <StatsCard
          title="Pending Estimates"
          value={dashboardStats.pendingEstimates}
          icon={FileText}
          change={{ value: 3, type: 'decrease' }}
        />
        <StatsCard
          title="Overdue Invoices"
          value={dashboardStats.overdueInvoices}
          icon={Receipt}
          change={{ value: 15, type: 'decrease' }}
        />
        <StatsCard
          title="Monthly Revenue"
          value={dashboardStats.monthlyRevenue}
          icon={DollarSign}
          format="currency"
          change={{ value: 23, type: 'increase' }}
        />
        <StatsCard
          title="Completion Rate"
          value={dashboardStats.completionRate}
          icon={TrendingUp}
          format="percentage"
          change={{ value: 5, type: 'increase' }}
        />
      </div>

      {/* AI Automations Section */}
      <AIAutomations />

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <RecentActivity activities={recentActivities} />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-8 w-8 text-primary-600 mb-2" />
                <span className="text-sm font-medium">Add Customer</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Briefcase className="h-8 w-8 text-primary-600 mb-2" />
                <span className="text-sm font-medium">Create Job</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="h-8 w-8 text-primary-600 mb-2" />
                <span className="text-sm font-medium">New Estimate</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Receipt className="h-8 w-8 text-primary-600 mb-2" />
                <span className="text-sm font-medium">Send Invoice</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Firebase Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Firebase Data Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{jobs.length}</div>
              <div className="text-sm text-blue-800">Jobs in Database</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{customers.length}</div>
              <div className="text-sm text-green-800">Customers Stored</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{estimates.length}</div>
              <div className="text-sm text-yellow-800">Estimates Tracked</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{invoices.length}</div>
              <div className="text-sm text-purple-800">Invoices Managed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
