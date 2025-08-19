'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Webhook as WebhookIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Power, 
  PowerOff,
  Copy,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Webhook } from '@/types/integrations';

export function WebhookManager() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: 'OpenAI Job Analysis',
      url: 'https://api.openai.com/v1/webhooks/job-analysis',
      events: ['job.created', 'job.completed', 'job.updated'],
      secret: 'whsec_1234567890abcdef',
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      lastTriggered: '2024-01-19T14:25:00Z',
      description: 'Analyzes job data using OpenAI GPT for insights and recommendations'
    },
    {
      id: '2',
      name: 'Slack Notifications',
      url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
      events: ['estimate.approved', 'invoice.paid', 'job.emergency'],
      isActive: true,
      createdAt: '2024-01-10T09:30:00Z',
      lastTriggered: '2024-01-19T13:45:00Z',
      description: 'Sends important notifications to team Slack channels'
    },
    {
      id: '3',
      name: 'Customer Portal Sync',
      url: 'https://customer-portal.example.com/api/webhooks/fieldpulse',
      events: ['customer.created', 'job.scheduled', 'invoice.generated'],
      isActive: false,
      createdAt: '2024-01-12T16:20:00Z',
      description: 'Syncs customer data with external portal'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);

  const toggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(webhook => 
      webhook.id === id 
        ? { ...webhook, isActive: !webhook.isActive }
        : webhook
    ));
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
  };

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const getStatusIcon = (webhook: Webhook) => {
    if (!webhook.isActive) {
      return <PowerOff className="h-4 w-4 text-gray-400" />;
    }
    if (webhook.lastTriggered) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = (webhook: Webhook) => {
    if (!webhook.isActive) return 'Inactive';
    if (webhook.lastTriggered) return 'Active';
    return 'Pending';
  };

  const getStatusColor = (webhook: Webhook) => {
    if (!webhook.isActive) return 'text-gray-500 bg-gray-50';
    if (webhook.lastTriggered) return 'text-green-700 bg-green-50';
    return 'text-yellow-700 bg-yellow-50';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <WebhookIcon className="h-5 w-5 text-primary-600" />
              Webhook Management
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Configure webhooks to integrate with external applications
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Webhook
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Webhook List */}
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{webhook.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(webhook)}`}>
                      {getStatusIcon(webhook)}
                      {getStatusText(webhook)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{webhook.description}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                      {webhook.url.length > 50 ? `${webhook.url.substring(0, 50)}...` : webhook.url}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyWebhookUrl(webhook.url)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(webhook.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {webhook.events.map((event) => (
                      <span
                        key={event}
                        className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Created: {new Date(webhook.createdAt).toLocaleDateString()}
                    {webhook.lastTriggered && (
                      <span className="ml-4">
                        Last triggered: {new Date(webhook.lastTriggered).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleWebhook(webhook.id)}
                    className={webhook.isActive ? 'text-green-600' : 'text-gray-400'}
                  >
                    {webhook.isActive ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingWebhook(webhook)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteWebhook(webhook.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {webhooks.length}
              </div>
              <div className="text-xs text-gray-600">Total Webhooks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {webhooks.filter(w => w.isActive).length}
              </div>
              <div className="text-xs text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {webhooks.filter(w => w.lastTriggered).length}
              </div>
              <div className="text-xs text-gray-600">Recently Used</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
