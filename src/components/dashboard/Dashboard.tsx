'use client';

import React from 'react';
import { StatsCard } from './StatsCard';
import { RecentActivity } from './RecentActivity';
import { AIAutomations } from './AIAutomations';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Receipt, 
  DollarSign,
  TrendingUp 
} from 'lucide-react';

export function Dashboard() {
  // Mock data for demonstration
  const mockStats = {
    totalCustomers: 247,
    activeJobs: 18,
    pendingEstimates: 7,
    overdueInvoices: 3,
    monthlyRevenue: 45250,
    completionRate: 87
  };

  const mockActivities = [
    {
      id: '1',
      type: 'job' as const,
      title: 'HVAC Maintenance - Johnson Residence',
      description: 'Status updated to in progress',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      status: 'in_progress'
    },
    {
      id: '2',
      type: 'estimate' as const,
      title: 'Kitchen Renovation - Smith Property',
      description: 'Estimate sent to customer',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      status: 'sent'
    },
    {
      id: '3',
      type: 'job' as const,
      title: 'Plumbing Repair - Downtown Office',
      description: 'Job completed successfully',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      status: 'completed'
    },
    {
      id: '4',
      type: 'invoice' as const,
      title: 'Invoice #INV-2024-0156',
      description: 'Payment received',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      status: 'paid'
    },
    {
      id: '5',
      type: 'customer' as const,
      title: 'New Customer Added',
      description: 'ABC Manufacturing Company',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Customers"
          value={mockStats.totalCustomers}
          icon={Users}
          change={{ value: 12, type: 'increase' }}
        />
        <StatsCard
          title="Active Jobs"
          value={mockStats.activeJobs}
          icon={Briefcase}
          change={{ value: 8, type: 'increase' }}
        />
        <StatsCard
          title="Pending Estimates"
          value={mockStats.pendingEstimates}
          icon={FileText}
          change={{ value: 3, type: 'decrease' }}
        />
        <StatsCard
          title="Overdue Invoices"
          value={mockStats.overdueInvoices}
          icon={Receipt}
          change={{ value: 15, type: 'decrease' }}
        />
        <StatsCard
          title="Monthly Revenue"
          value={mockStats.monthlyRevenue}
          icon={DollarSign}
          format="currency"
          change={{ value: 23, type: 'increase' }}
        />
        <StatsCard
          title="Completion Rate"
          value={mockStats.completionRate}
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
        <RecentActivity activities={mockActivities} />

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
    </div>
  );
}
