'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Key, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Copy,
  Shield,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { APIKey } from '@/types/integrations';

export function APIKeyManager() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'OpenAI GPT-4',
      service: 'openai',
      key: 'sk-proj-1234567890abcdef1234567890abcdef1234567890abcdef',
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      lastUsed: '2024-01-19T14:25:00Z',
      description: 'Main OpenAI API key for job analysis and customer support',
      permissions: ['gpt-4', 'gpt-3.5-turbo', 'embeddings']
    },
    {
      id: '2',
      name: 'Azure OpenAI Service',
      service: 'azure',
      key: 'abc123def456ghi789jkl012mno345pqr678stu901vwx234',
      isActive: true,
      createdAt: '2024-01-10T09:30:00Z',
      lastUsed: '2024-01-18T16:20:00Z',
      description: 'Enterprise Azure OpenAI for secure AI processing',
      permissions: ['gpt-4', 'dalle-3', 'whisper']
    },
    {
      id: '3',
      name: 'Google Vertex AI',
      service: 'google',
      key: 'AIzaSyD1234567890abcdef1234567890abcdef123',
      isActive: false,
      createdAt: '2024-01-12T16:20:00Z',
      description: 'Google AI services for document processing',
      permissions: ['palm-2', 'text-bison', 'code-bison']
    },
    {
      id: '4',
      name: 'Anthropic Claude',
      service: 'anthropic',
      key: 'sk-ant-api03-1234567890abcdef1234567890abcdef1234567890abcdef',
      isActive: true,
      createdAt: '2024-01-08T11:15:00Z',
      lastUsed: '2024-01-19T09:30:00Z',
      description: 'Claude for complex reasoning and analysis tasks',
      permissions: ['claude-3-opus', 'claude-3-sonnet']
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleApiKey = (id: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === id 
        ? { ...key, isActive: !key.isActive }
        : key
    ));
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.substring(0, 8)}${'*'.repeat(key.length - 16)}${key.substring(key.length - 8)}`;
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'openai':
        return '🤖';
      case 'anthropic':
        return '🧠';
      case 'google':
        return '🔍';
      case 'azure':
        return '☁️';
      default:
        return '🔧';
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'openai':
        return 'bg-green-100 text-green-800';
      case 'anthropic':
        return 'bg-purple-100 text-purple-800';
      case 'google':
        return 'bg-blue-100 text-blue-800';
      case 'azure':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (apiKey: APIKey) => {
    if (!apiKey.isActive) {
      return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
    if (apiKey.lastUsed) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Shield className="h-4 w-4 text-blue-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary-600" />
              API Key Management
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Manage API keys for external AI services and integrations
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add API Key
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* API Key List */}
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{apiKey.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getServiceColor(apiKey.service)}`}>
                      {getServiceIcon(apiKey.service)}
                      {apiKey.service.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      apiKey.isActive ? 'text-green-700 bg-green-50' : 'text-gray-700 bg-gray-50'
                    }`}>
                      {getStatusIcon(apiKey)}
                      {apiKey.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{apiKey.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-1">
                      {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {visibleKeys.has(apiKey.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyApiKey(apiKey.key)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {apiKey.permissions && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {apiKey.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                    {apiKey.lastUsed && (
                      <span className="ml-4">
                        Last used: {new Date(apiKey.lastUsed).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleApiKey(apiKey.id)}
                    className={apiKey.isActive ? 'text-green-600' : 'text-gray-400'}
                  >
                    <Zap className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteApiKey(apiKey.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Statistics */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Usage Statistics</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {apiKeys.length}
              </div>
              <div className="text-xs text-gray-600">Total Keys</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {apiKeys.filter(k => k.isActive).length}
              </div>
              <div className="text-xs text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(apiKeys.map(k => k.service)).size}
              </div>
              <div className="text-xs text-gray-600">Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {apiKeys.filter(k => k.lastUsed).length}
              </div>
              <div className="text-xs text-gray-600">Recently Used</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
