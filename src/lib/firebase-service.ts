import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Job, Customer, Estimate, Invoice, Project, User, Team, Asset, Location, Timesheet, Comment } from '@/types/fieldpulse';
import { Webhook, APIKey, Integration, WebhookEvent } from '@/types/integrations';

export class FirebaseService {
  // Generic CRUD operations
  async create<T>(collectionName: string, data: Omit<T, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error(`Error updating document ${id} in ${collectionName}:`, error);
      throw error;
    }
  }

  async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document ${id} from ${collectionName}:`, error);
      throw error;
    }
  }

  async getById<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting document ${id} from ${collectionName}:`, error);
      throw error;
    }
  }

  async getAll<T>(collectionName: string, limitCount?: number): Promise<T[]> {
    try {
      let q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
      
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as T[];
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  }

  async getWhere<T>(
    collectionName: string, 
    field: string, 
    operator: any, 
    value: any
  ): Promise<T[]> {
    try {
      const q = query(
        collection(db, collectionName), 
        where(field, operator, value),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as T[];
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      throw error;
    }
  }

  // Real-time listeners
  subscribeToCollection<T>(
    collectionName: string,
    callback: (data: T[]) => void,
    limitCount?: number
  ): () => void {
    let q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as T[];
      callback(data);
    });
  }

  subscribeToDocument<T>(
    collectionName: string,
    id: string,
    callback: (data: T | null) => void
  ): () => void {
    const docRef = doc(db, collectionName, id);
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as T);
      } else {
        callback(null);
      }
    });
  }

  // FieldPulse specific methods
  async createJob(job: Omit<Job, 'id'>): Promise<string> {
    return this.create<Job>('jobs', job);
  }

  async updateJob(id: string, job: Partial<Job>): Promise<void> {
    return this.update<Job>('jobs', id, job);
  }

  async getJobs(limitCount?: number): Promise<Job[]> {
    return this.getAll<Job>('jobs', limitCount);
  }

  async getJobsByStatus(status: string): Promise<Job[]> {
    return this.getWhere<Job>('jobs', 'status', '==', status);
  }

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<string> {
    return this.create<Customer>('customers', customer);
  }

  async getCustomers(limitCount?: number): Promise<Customer[]> {
    return this.getAll<Customer>('customers', limitCount);
  }

  async createEstimate(estimate: Omit<Estimate, 'id'>): Promise<string> {
    return this.create<Estimate>('estimates', estimate);
  }

  async getEstimates(limitCount?: number): Promise<Estimate[]> {
    return this.getAll<Estimate>('estimates', limitCount);
  }

  async createInvoice(invoice: Omit<Invoice, 'id'>): Promise<string> {
    return this.create<Invoice>('invoices', invoice);
  }

  async getInvoices(limitCount?: number): Promise<Invoice[]> {
    return this.getAll<Invoice>('invoices', limitCount);
  }

  // Integration specific methods
  async createWebhook(webhook: Omit<Webhook, 'id'>): Promise<string> {
    return this.create<Webhook>('webhooks', webhook);
  }

  async updateWebhook(id: string, webhook: Partial<Webhook>): Promise<void> {
    return this.update<Webhook>('webhooks', id, webhook);
  }

  async getWebhooks(): Promise<Webhook[]> {
    return this.getAll<Webhook>('webhooks');
  }

  async createAPIKey(apiKey: Omit<APIKey, 'id'>): Promise<string> {
    return this.create<APIKey>('apiKeys', apiKey);
  }

  async updateAPIKey(id: string, apiKey: Partial<APIKey>): Promise<void> {
    return this.update<APIKey>('apiKeys', id, apiKey);
  }

  async getAPIKeys(): Promise<APIKey[]> {
    return this.getAll<APIKey>('apiKeys');
  }

  async createWebhookEvent(event: Omit<WebhookEvent, 'id'>): Promise<string> {
    return this.create<WebhookEvent>('webhookEvents', event);
  }

  async getWebhookEvents(webhookId?: string): Promise<WebhookEvent[]> {
    if (webhookId) {
      return this.getWhere<WebhookEvent>('webhookEvents', 'webhookId', '==', webhookId);
    }
    return this.getAll<WebhookEvent>('webhookEvents', 100);
  }

  // Analytics and reporting
  async getDashboardStats(): Promise<{
    totalCustomers: number;
    activeJobs: number;
    pendingEstimates: number;
    overdueInvoices: number;
    monthlyRevenue: number;
  }> {
    try {
      const [customers, jobs, estimates, invoices] = await Promise.all([
        this.getCustomers(),
        this.getJobs(),
        this.getEstimates(),
        this.getInvoices()
      ]);

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

      return {
        totalCustomers: customers.length,
        activeJobs,
        pendingEstimates,
        overdueInvoices,
        monthlyRevenue
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  // Bulk operations
  async bulkCreate<T>(collectionName: string, items: Omit<T, 'id'>[]): Promise<string[]> {
    const promises = items.map(item => this.create<T>(collectionName, item));
    return Promise.all(promises);
  }

  async bulkUpdate<T>(collectionName: string, updates: Array<{ id: string; data: Partial<T> }>): Promise<void> {
    const promises = updates.map(update => this.update<T>(collectionName, update.id, update.data));
    await Promise.all(promises);
  }

  // Search functionality
  async searchJobs(searchTerm: string): Promise<Job[]> {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation - consider using Algolia or similar for advanced search
    const jobs = await this.getJobs();
    return jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  async searchCustomers(searchTerm: string): Promise<Customer[]> {
    const customers = await this.getCustomers();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
}

// Singleton instance
export const firebaseService = new FirebaseService();
