'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseService } from '@/lib/firebase-service';
import { Job, Customer, Estimate, Invoice } from '@/types/fieldpulse';
import { Webhook, APIKey } from '@/types/integrations';

interface FirebaseContextType {
  // Data state
  jobs: Job[];
  customers: Customer[];
  estimates: Estimate[];
  invoices: Invoice[];
  webhooks: Webhook[];
  apiKeys: APIKey[];
  
  // Loading states
  isLoading: boolean;
  isJobsLoading: boolean;
  isCustomersLoading: boolean;
  
  // CRUD operations
  createJob: (job: Omit<Job, 'id'>) => Promise<string>;
  updateJob: (id: string, job: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  
  createCustomer: (customer: Omit<Customer, 'id'>) => Promise<string>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  createWebhook: (webhook: Omit<Webhook, 'id'>) => Promise<string>;
  updateWebhook: (id: string, webhook: Partial<Webhook>) => Promise<void>;
  deleteWebhook: (id: string) => Promise<void>;
  
  createAPIKey: (apiKey: Omit<APIKey, 'id'>) => Promise<string>;
  updateAPIKey: (id: string, apiKey: Partial<APIKey>) => Promise<void>;
  deleteAPIKey: (id: string) => Promise<void>;
  
  // Refresh data
  refreshData: () => Promise<void>;
  
  // Real-time subscriptions
  enableRealTimeSync: boolean;
  setEnableRealTimeSync: (enabled: boolean) => void;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  // Data state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [apiKeys, setAPIKeys] = useState<APIKey[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isJobsLoading, setIsJobsLoading] = useState(false);
  const [isCustomersLoading, setIsCustomersLoading] = useState(false);
  
  // Real-time sync
  const [enableRealTimeSync, setEnableRealTimeSync] = useState(true);
  const [unsubscribeFunctions, setUnsubscribeFunctions] = useState<(() => void)[]>([]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Setup real-time listeners
  useEffect(() => {
    if (enableRealTimeSync) {
      setupRealTimeListeners();
    } else {
      cleanupListeners();
    }

    return () => cleanupListeners();
  }, [enableRealTimeSync]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      const [
        jobsData,
        customersData,
        estimatesData,
        invoicesData,
        webhooksData,
        apiKeysData
      ] = await Promise.all([
        firebaseService.getJobs(50),
        firebaseService.getCustomers(50),
        firebaseService.getEstimates(50),
        firebaseService.getInvoices(50),
        firebaseService.getWebhooks(),
        firebaseService.getAPIKeys()
      ]);

      setJobs(jobsData);
      setCustomers(customersData);
      setEstimates(estimatesData);
      setInvoices(invoicesData);
      setWebhooks(webhooksData);
      setAPIKeys(apiKeysData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealTimeListeners = () => {
    const unsubscribes: (() => void)[] = [];

    // Jobs listener
    const unsubscribeJobs = firebaseService.subscribeToCollection<Job>(
      'jobs',
      (data) => setJobs(data),
      50
    );
    unsubscribes.push(unsubscribeJobs);

    // Customers listener
    const unsubscribeCustomers = firebaseService.subscribeToCollection<Customer>(
      'customers',
      (data) => setCustomers(data),
      50
    );
    unsubscribes.push(unsubscribeCustomers);

    // Estimates listener
    const unsubscribeEstimates = firebaseService.subscribeToCollection<Estimate>(
      'estimates',
      (data) => setEstimates(data),
      50
    );
    unsubscribes.push(unsubscribeEstimates);

    // Invoices listener
    const unsubscribeInvoices = firebaseService.subscribeToCollection<Invoice>(
      'invoices',
      (data) => setInvoices(data),
      50
    );
    unsubscribes.push(unsubscribeInvoices);

    // Webhooks listener
    const unsubscribeWebhooks = firebaseService.subscribeToCollection<Webhook>(
      'webhooks',
      (data) => setWebhooks(data)
    );
    unsubscribes.push(unsubscribeWebhooks);

    // API Keys listener
    const unsubscribeAPIKeys = firebaseService.subscribeToCollection<APIKey>(
      'apiKeys',
      (data) => setAPIKeys(data)
    );
    unsubscribes.push(unsubscribeAPIKeys);

    setUnsubscribeFunctions(unsubscribes);
  };

  const cleanupListeners = () => {
    unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    setUnsubscribeFunctions([]);
  };

  // CRUD operations
  const createJob = async (job: Omit<Job, 'id'>): Promise<string> => {
    setIsJobsLoading(true);
    try {
      const id = await firebaseService.createJob(job);
      if (!enableRealTimeSync) {
        const updatedJobs = await firebaseService.getJobs(50);
        setJobs(updatedJobs);
      }
      return id;
    } finally {
      setIsJobsLoading(false);
    }
  };

  const updateJob = async (id: string, job: Partial<Job>): Promise<void> => {
    setIsJobsLoading(true);
    try {
      await firebaseService.updateJob(id, job);
      if (!enableRealTimeSync) {
        const updatedJobs = await firebaseService.getJobs(50);
        setJobs(updatedJobs);
      }
    } finally {
      setIsJobsLoading(false);
    }
  };

  const deleteJob = async (id: string): Promise<void> => {
    setIsJobsLoading(true);
    try {
      await firebaseService.delete('jobs', id);
      if (!enableRealTimeSync) {
        const updatedJobs = await firebaseService.getJobs(50);
        setJobs(updatedJobs);
      }
    } finally {
      setIsJobsLoading(false);
    }
  };

  const createCustomer = async (customer: Omit<Customer, 'id'>): Promise<string> => {
    setIsCustomersLoading(true);
    try {
      const id = await firebaseService.createCustomer(customer);
      if (!enableRealTimeSync) {
        const updatedCustomers = await firebaseService.getCustomers(50);
        setCustomers(updatedCustomers);
      }
      return id;
    } finally {
      setIsCustomersLoading(false);
    }
  };

  const updateCustomer = async (id: string, customer: Partial<Customer>): Promise<void> => {
    setIsCustomersLoading(true);
    try {
      await firebaseService.update('customers', id, customer);
      if (!enableRealTimeSync) {
        const updatedCustomers = await firebaseService.getCustomers(50);
        setCustomers(updatedCustomers);
      }
    } finally {
      setIsCustomersLoading(false);
    }
  };

  const deleteCustomer = async (id: string): Promise<void> => {
    setIsCustomersLoading(true);
    try {
      await firebaseService.delete('customers', id);
      if (!enableRealTimeSync) {
        const updatedCustomers = await firebaseService.getCustomers(50);
        setCustomers(updatedCustomers);
      }
    } finally {
      setIsCustomersLoading(false);
    }
  };

  const createWebhook = async (webhook: Omit<Webhook, 'id'>): Promise<string> => {
    const id = await firebaseService.createWebhook(webhook);
    if (!enableRealTimeSync) {
      const updatedWebhooks = await firebaseService.getWebhooks();
      setWebhooks(updatedWebhooks);
    }
    return id;
  };

  const updateWebhook = async (id: string, webhook: Partial<Webhook>): Promise<void> => {
    await firebaseService.updateWebhook(id, webhook);
    if (!enableRealTimeSync) {
      const updatedWebhooks = await firebaseService.getWebhooks();
      setWebhooks(updatedWebhooks);
    }
  };

  const deleteWebhook = async (id: string): Promise<void> => {
    await firebaseService.delete('webhooks', id);
    if (!enableRealTimeSync) {
      const updatedWebhooks = await firebaseService.getWebhooks();
      setWebhooks(updatedWebhooks);
    }
  };

  const createAPIKey = async (apiKey: Omit<APIKey, 'id'>): Promise<string> => {
    const id = await firebaseService.createAPIKey(apiKey);
    if (!enableRealTimeSync) {
      const updatedAPIKeys = await firebaseService.getAPIKeys();
      setAPIKeys(updatedAPIKeys);
    }
    return id;
  };

  const updateAPIKey = async (id: string, apiKey: Partial<APIKey>): Promise<void> => {
    await firebaseService.updateAPIKey(id, apiKey);
    if (!enableRealTimeSync) {
      const updatedAPIKeys = await firebaseService.getAPIKeys();
      setAPIKeys(updatedAPIKeys);
    }
  };

  const deleteAPIKey = async (id: string): Promise<void> => {
    await firebaseService.delete('apiKeys', id);
    if (!enableRealTimeSync) {
      const updatedAPIKeys = await firebaseService.getAPIKeys();
      setAPIKeys(updatedAPIKeys);
    }
  };

  const refreshData = async (): Promise<void> => {
    await loadInitialData();
  };

  const value: FirebaseContextType = {
    // Data
    jobs,
    customers,
    estimates,
    invoices,
    webhooks,
    apiKeys,
    
    // Loading states
    isLoading,
    isJobsLoading,
    isCustomersLoading,
    
    // CRUD operations
    createJob,
    updateJob,
    deleteJob,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    createAPIKey,
    updateAPIKey,
    deleteAPIKey,
    
    // Utilities
    refreshData,
    enableRealTimeSync,
    setEnableRealTimeSync
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
