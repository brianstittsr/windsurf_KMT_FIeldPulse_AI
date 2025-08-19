'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Bot, 
  Brain, 
  Zap, 
  MessageSquare, 
  FileSearch, 
  TrendingUp,
  Play,
  Pause,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface AutomationCard {
  id: string;
  title: string;
  description: string;
  technology: 'langchain' | 'llamaindex';
  status: 'active' | 'inactive' | 'running';
  icon: React.ComponentType<any>;
  lastRun?: string;
  successRate: number;
}

export function AIAutomations() {
  const [automations, setAutomations] = useState<AutomationCard[]>([
    {
      id: '1',
      title: 'Smart Job Scheduling',
      description: 'AI-powered job scheduling optimization using LangChain agents to analyze technician availability, location, and skills.',
      technology: 'langchain',
      status: 'active',
      icon: Brain,
      lastRun: '2 hours ago',
      successRate: 94
    },
    {
      id: '2',
      title: 'Customer Query Assistant',
      description: 'LlamaIndex-powered chatbot that answers customer questions using your service history and knowledge base.',
      technology: 'llamaindex',
      status: 'active',
      icon: MessageSquare,
      lastRun: '15 minutes ago',
      successRate: 98
    },
    {
      id: '3',
      title: 'Document Intelligence',
      description: 'Extract insights from invoices, estimates, and contracts using LlamaIndex document processing.',
      technology: 'llamaindex',
      status: 'running',
      icon: FileSearch,
      lastRun: 'Running now',
      successRate: 89
    },
    {
      id: '4',
      title: 'Predictive Maintenance',
      description: 'LangChain-based system that predicts equipment failures and schedules preventive maintenance.',
      technology: 'langchain',
      status: 'inactive',
      icon: TrendingUp,
      lastRun: '1 day ago',
      successRate: 87
    },
    {
      id: '5',
      title: 'Smart Estimate Generator',
      description: 'Generate accurate project estimates using historical data and AI reasoning with LangChain.',
      technology: 'langchain',
      status: 'active',
      icon: Zap,
      lastRun: '30 minutes ago',
      successRate: 92
    },
    {
      id: '6',
      title: 'Knowledge Base Search',
      description: 'LlamaIndex semantic search across all company documents, manuals, and procedures.',
      technology: 'llamaindex',
      status: 'active',
      icon: Bot,
      lastRun: '5 minutes ago',
      successRate: 96
    }
  ]);

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id 
        ? { 
            ...automation, 
            status: automation.status === 'active' ? 'inactive' : 'active' 
          }
        : automation
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'running':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'inactive':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTechnologyBadge = (technology: string) => {
    const isLangChain = technology === 'langchain';
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isLangChain 
          ? 'bg-purple-100 text-purple-800' 
          : 'bg-orange-100 text-orange-800'
      }`}>
        {isLangChain ? '🦜 LangChain' : '🦙 LlamaIndex'}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary-600" />
              AI Automations
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Intelligent automation powered by LangChain and LlamaIndex
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {automations.map((automation) => {
            const IconComponent = automation.icon;
            return (
              <div
                key={automation.id}
                className={`border rounded-lg p-4 transition-all hover:shadow-md ${getStatusColor(automation.status)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    {getStatusIcon(automation.status)}
                  </div>
                  <div className="flex gap-2">
                    {getTechnologyBadge(automation.technology)}
                  </div>
                </div>
                
                <h3 className="font-semibold text-sm mb-2">{automation.title}</h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                  {automation.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Last run: {automation.lastRun}</span>
                  <span>{automation.successRate}% success</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={automation.status === 'active' ? 'outline' : 'primary'}
                    onClick={() => toggleAutomation(automation.id)}
                    className="flex-1"
                  >
                    {automation.status === 'active' ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {automations.filter(a => a.status === 'active').length}
              </div>
              <div className="text-xs text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {automations.filter(a => a.status === 'running').length}
              </div>
              <div className="text-xs text-gray-600">Running</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {Math.round(automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length)}%
              </div>
              <div className="text-xs text-gray-600">Avg Success</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-xs text-gray-600">Monitoring</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
