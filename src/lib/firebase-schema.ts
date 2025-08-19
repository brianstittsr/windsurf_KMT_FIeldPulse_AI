import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { 
  Customer, 
  Job, 
  Estimate, 
  Invoice, 
  Project, 
  User, 
  Team, 
  Asset, 
  Location, 
  Subtask, 
  Comment, 
  Timesheet 
} from '@/types/fieldpulse';
import type { Webhook, APIKey, Integration } from '@/types/integrations';

// Collection names
export const COLLECTIONS = {
  CUSTOMERS: 'customers',
  JOBS: 'jobs',
  ESTIMATES: 'estimates',
  INVOICES: 'invoices',
  PROJECTS: 'projects',
  USERS: 'users',
  TEAMS: 'teams',
  ASSETS: 'assets',
  LOCATIONS: 'locations',
  SUBTASKS: 'subtasks',
  COMMENTS: 'comments',
  TIMESHEETS: 'timesheets',
  WEBHOOKS: 'webhooks',
  API_KEYS: 'apiKeys',
  INTEGRATIONS: 'integrations',
  AI_AUTOMATIONS: 'aiAutomations',
  SETTINGS: 'settings'
} as const;

// Schema validation functions
export const validateCustomer = (data: Partial<Customer>): boolean => {
  return !!(data.name && data.email);
};

export const validateJob = (data: Partial<Job>): boolean => {
  return !!(data.customer_id && data.title && data.status);
};

export const validateEstimate = (data: Partial<Estimate>): boolean => {
  return !!(data.customer_id && data.title && typeof data.total_amount === 'number');
};

export const validateInvoice = (data: Partial<Invoice>): boolean => {
  return !!(data.customer_id && data.invoice_number && typeof data.total_amount === 'number');
};

// Sample data creation functions
export const createSampleCustomers = async (): Promise<void> => {
  const customers: Omit<Customer, 'id'>[] = [
    {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zip: '62702',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      phone: '(555) 555-0123',
      address: '789 Pine St',
      city: 'Springfield',
      state: 'IL',
      zip: '62703',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  for (const customer of customers) {
    await addDoc(collection(db, COLLECTIONS.CUSTOMERS), customer);
  }
};

export const createSampleJobs = async (): Promise<void> => {
  // First get customer IDs (in real implementation, you'd query for them)
  const jobs: Omit<Job, 'id'>[] = [
    {
      customer_id: 'customer_1', // This would be actual customer ID
      title: 'HVAC System Installation',
      description: 'Install new HVAC system in residential home',
      status: 'in_progress',
      priority: 'high',
      scheduled_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      assigned_to: 'tech_1',
      location: '123 Main St, Springfield, IL',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      customer_id: 'customer_2',
      title: 'Plumbing Repair',
      description: 'Fix leaking pipes in basement',
      status: 'scheduled',
      priority: 'medium',
      scheduled_date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      assigned_to: 'tech_2',
      location: '456 Oak Ave, Springfield, IL',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      customer_id: 'customer_3',
      title: 'Electrical Inspection',
      description: 'Annual electrical system inspection',
      status: 'completed',
      priority: 'low',
      scheduled_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      completed_date: new Date().toISOString(),
      assigned_to: 'tech_3',
      location: '789 Pine St, Springfield, IL',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  for (const job of jobs) {
    await addDoc(collection(db, COLLECTIONS.JOBS), job);
  }
};

export const createSampleEstimates = async (): Promise<void> => {
  const estimates: Omit<Estimate, 'id'>[] = [
    {
      customer_id: 'customer_1',
      title: 'HVAC System Estimate',
      description: 'Complete HVAC system replacement',
      total_amount: 8500.00,
      status: 'sent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      customer_id: 'customer_2',
      title: 'Bathroom Renovation Estimate',
      description: 'Full bathroom renovation including plumbing',
      total_amount: 12000.00,
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  for (const estimate of estimates) {
    await addDoc(collection(db, COLLECTIONS.ESTIMATES), estimate);
  }
};

export const createSampleInvoices = async (): Promise<void> => {
  const invoices: Omit<Invoice, 'id'>[] = [
    {
      customer_id: 'customer_3',
      job_id: 'job_3',
      invoice_number: 'INV-2024-001',
      total_amount: 350.00,
      status: 'paid',
      due_date: new Date(Date.now() + 2592000000).toISOString(), // 30 days from now
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      customer_id: 'customer_1',
      invoice_number: 'INV-2024-002',
      total_amount: 1250.00,
      status: 'sent',
      due_date: new Date(Date.now() + 1296000000).toISOString(), // 15 days from now
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  for (const invoice of invoices) {
    await addDoc(collection(db, COLLECTIONS.INVOICES), invoice);
  }
};

export const createSampleWebhooks = async (): Promise<void> => {
  const webhooks: Omit<Webhook, 'id'>[] = [
    {
      name: 'Job Status Updates',
      url: 'https://api.example.com/webhooks/job-status',
      events: ['job.created', 'job.updated', 'job.completed'],
      secret: 'webhook_secret_123',
      isActive: true,
      createdAt: new Date().toISOString(),
      description: 'Webhook for job status change notifications'
    },
    {
      name: 'Customer Notifications',
      url: 'https://notifications.example.com/customer-updates',
      events: ['customer.created', 'estimate.sent', 'invoice.sent'],
      isActive: true,
      createdAt: new Date().toISOString(),
      description: 'Customer notification webhook'
    }
  ];

  for (const webhook of webhooks) {
    await addDoc(collection(db, COLLECTIONS.WEBHOOKS), webhook);
  }
};

export const createSampleAPIKeys = async (): Promise<void> => {
  const apiKeys: Omit<APIKey, 'id'>[] = [
    {
      name: 'OpenAI Integration',
      service: 'openai',
      key: 'sk-...',
      isActive: true,
      createdAt: new Date().toISOString(),
      description: 'API key for OpenAI AI automations',
      permissions: ['chat', 'completion', 'embedding']
    },
    {
      name: 'Google Maps API',
      service: 'google',
      key: 'AIza...',
      isActive: true,
      createdAt: new Date().toISOString(),
      description: 'Google Maps API for location services',
      permissions: ['geocoding', 'directions']
    }
  ];

  for (const apiKey of apiKeys) {
    await addDoc(collection(db, COLLECTIONS.API_KEYS), apiKey);
  }
};

// AI Automation schema
export interface AIAutomation {
  id: string;
  name: string;
  type: 'langchain' | 'llamaindex' | 'openai' | 'custom';
  description: string;
  isActive: boolean;
  config: {
    model?: string;
    prompt?: string;
    temperature?: number;
    maxTokens?: number;
    triggers?: string[];
  };
  stats: {
    totalRuns: number;
    successRate: number;
    lastRun?: string;
    avgProcessingTime?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export const createSampleAIAutomations = async (): Promise<void> => {
  const automations: Omit<AIAutomation, 'id'>[] = [
    {
      name: 'Smart Job Scheduling',
      type: 'langchain',
      description: 'Automatically schedule jobs based on technician availability and location',
      isActive: true,
      config: {
        model: 'gpt-4',
        triggers: ['job.created', 'technician.available'],
        temperature: 0.3
      },
      stats: {
        totalRuns: 156,
        successRate: 94,
        lastRun: new Date().toISOString(),
        avgProcessingTime: 2.3
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'Customer Query Assistant',
      type: 'openai',
      description: 'AI-powered customer support chatbot',
      isActive: true,
      config: {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 500
      },
      stats: {
        totalRuns: 342,
        successRate: 89,
        lastRun: new Date().toISOString(),
        avgProcessingTime: 1.8
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'Document Intelligence',
      type: 'llamaindex',
      description: 'Extract and analyze information from service documents',
      isActive: true,
      config: {
        triggers: ['document.uploaded'],
        temperature: 0.2
      },
      stats: {
        totalRuns: 78,
        successRate: 96,
        lastRun: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        avgProcessingTime: 5.2
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  for (const automation of automations) {
    await addDoc(collection(db, COLLECTIONS.AI_AUTOMATIONS), automation);
  }
};

// Initialize all sample data
export const initializeFirebaseSchema = async (): Promise<void> => {
  try {
    console.log('Initializing Firebase schema with sample data...');
    
    await createSampleCustomers();
    console.log('✓ Sample customers created');
    
    await createSampleJobs();
    console.log('✓ Sample jobs created');
    
    await createSampleEstimates();
    console.log('✓ Sample estimates created');
    
    await createSampleInvoices();
    console.log('✓ Sample invoices created');
    
    await createSampleWebhooks();
    console.log('✓ Sample webhooks created');
    
    await createSampleAPIKeys();
    console.log('✓ Sample API keys created');
    
    await createSampleAIAutomations();
    console.log('✓ Sample AI automations created');
    
    console.log('Firebase schema initialization complete!');
  } catch (error) {
    console.error('Error initializing Firebase schema:', error);
    throw error;
  }
};

// Export collection references for easy access
export const getCollectionRef = (collectionName: string) => {
  return collection(db, collectionName);
};

export const getDocRef = (collectionName: string, docId: string) => {
  return doc(db, collectionName, docId);
};
