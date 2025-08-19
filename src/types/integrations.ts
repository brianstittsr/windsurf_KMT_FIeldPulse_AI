export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  headers?: Record<string, string>;
  description?: string;
}

export interface APIKey {
  id: string;
  name: string;
  service: 'openai' | 'anthropic' | 'google' | 'azure' | 'custom';
  key: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  description?: string;
  permissions?: string[];
}

export interface WebhookEvent {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  attempts: number;
  createdAt: string;
  processedAt?: string;
  error?: string;
}

export interface Integration {
  id: string;
  name: string;
  type: 'webhook' | 'api';
  service: string;
  isActive: boolean;
  config: Record<string, any>;
  createdAt: string;
  lastSync?: string;
}

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: any;
  source: 'fieldpulse' | 'external';
}

export interface AIServiceConfig {
  openai?: {
    apiKey: string;
    model: string;
    maxTokens: number;
  };
  anthropic?: {
    apiKey: string;
    model: string;
  };
  azure?: {
    apiKey: string;
    endpoint: string;
    deployment: string;
  };
}
