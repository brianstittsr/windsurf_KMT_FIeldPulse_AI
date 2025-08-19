'use client';

import React, { useState } from 'react';
import { WebhookManager } from './WebhookManager';
import { APIKeyManager } from './APIKeyManager';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Settings, 
  Webhook, 
  Key, 
  Zap, 
  Activity,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

export function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'webhooks' | 'apikeys' | 'overview'>('overview');

  const integrationStats = {
    totalWebhooks: 3,
    activeWebhooks: 2,
    totalApiKeys: 4,
    activeApiKeys: 3,
    recentEvents: 156,
    successRate: 98.5
  };

  const recentActivity = [
    {
      id: '1',
      type: 'webhook',
      event: 'job.completed',
      service: 'OpenAI Analysis',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: '2',
      type: 'api',
      event: 'estimate.generated',
      service: 'OpenAI GPT-4',
      timestamp: '15 minutes ago',
      status: 'success'
    },
    {
      id: '3',
      type: 'webhook',
      event: 'invoice.paid',
      service: 'Slack Notification',
      timestamp: '1 hour ago',
      status: 'success'
    },
    {
      id: '4',
      type: 'api',
      event: 'customer.query',
      service: 'Anthropic Claude',
      timestamp: '2 hours ago',
      status: 'failed'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'apikeys', label: 'API Keys', icon: Key }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600">Manage webhooks, API keys, and external service connections</p>
        </div>
        <Button className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Webhook className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Webhooks</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {integrationStats.activeWebhooks}/{integrationStats.totalWebhooks}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Key className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">API Keys</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {integrationStats.activeApiKeys}/{integrationStats.totalApiKeys}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Events (24h)</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {integrationStats.recentEvents}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Success Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {integrationStats.successRate}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 ${
                        activity.type === 'webhook' ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {activity.type === 'webhook' ? 
                          <Webhook className="h-5 w-5" /> : 
                          <Key className="h-5 w-5" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.event}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.service} • {activity.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {activity.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => setActiveTab('webhooks')}
                >
                  <Webhook className="h-6 w-6 mb-2" />
                  Add Webhook
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => setActiveTab('apikeys')}
                >
                  <Key className="h-6 w-6 mb-2" />
                  Add API Key
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Settings className="h-6 w-6 mb-2" />
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'webhooks' && <WebhookManager />}
      {activeTab === 'apikeys' && <APIKeyManager />}
    </div>
  );
}
