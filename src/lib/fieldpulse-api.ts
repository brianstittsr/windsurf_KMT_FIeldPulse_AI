import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
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
  Timesheet,
  ApiResponse,
  PaginatedResponse,
  DashboardStats
} from '@/types/fieldpulse';

class FieldPulseAPI {
  private client: AxiosInstance;

  constructor(apiKey?: string, baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || process.env.FIELDPULSE_BASE_URL || 'https://api.fieldpulse.com',
      headers: {
        'Authorization': `Bearer ${apiKey || process.env.FIELDPULSE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Response Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'API request failed');
      }
    );
  }

  // Customers
  async getCustomers(page = 1, limit = 20): Promise<PaginatedResponse<Customer>> {
    const response: AxiosResponse<PaginatedResponse<Customer>> = await this.client.get(
      `/customers?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    const response: AxiosResponse<ApiResponse<Customer>> = await this.client.get(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(customer: Partial<Customer>): Promise<ApiResponse<Customer>> {
    const response: AxiosResponse<ApiResponse<Customer>> = await this.client.post('/customers', customer);
    return response.data;
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<ApiResponse<Customer>> {
    const response: AxiosResponse<ApiResponse<Customer>> = await this.client.put(`/customers/${id}`, customer);
    return response.data;
  }

  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.client.delete(`/customers/${id}`);
    return response.data;
  }

  // Jobs
  async getJobs(page = 1, limit = 20): Promise<PaginatedResponse<Job>> {
    const response: AxiosResponse<PaginatedResponse<Job>> = await this.client.get(
      `/jobs?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getJob(id: string): Promise<ApiResponse<Job>> {
    const response: AxiosResponse<ApiResponse<Job>> = await this.client.get(`/jobs/${id}`);
    return response.data;
  }

  async createJob(job: Partial<Job>): Promise<ApiResponse<Job>> {
    const response: AxiosResponse<ApiResponse<Job>> = await this.client.post('/jobs', job);
    return response.data;
  }

  async updateJob(id: string, job: Partial<Job>): Promise<ApiResponse<Job>> {
    const response: AxiosResponse<ApiResponse<Job>> = await this.client.put(`/jobs/${id}`, job);
    return response.data;
  }

  async deleteJob(id: string): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.client.delete(`/jobs/${id}`);
    return response.data;
  }

  // Estimates
  async getEstimates(page = 1, limit = 20): Promise<PaginatedResponse<Estimate>> {
    const response: AxiosResponse<PaginatedResponse<Estimate>> = await this.client.get(
      `/estimates?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getEstimate(id: string): Promise<ApiResponse<Estimate>> {
    const response: AxiosResponse<ApiResponse<Estimate>> = await this.client.get(`/estimates/${id}`);
    return response.data;
  }

  async createEstimate(estimate: Partial<Estimate>): Promise<ApiResponse<Estimate>> {
    const response: AxiosResponse<ApiResponse<Estimate>> = await this.client.post('/estimates', estimate);
    return response.data;
  }

  async updateEstimate(id: string, estimate: Partial<Estimate>): Promise<ApiResponse<Estimate>> {
    const response: AxiosResponse<ApiResponse<Estimate>> = await this.client.put(`/estimates/${id}`, estimate);
    return response.data;
  }

  async deleteEstimate(id: string): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.client.delete(`/estimates/${id}`);
    return response.data;
  }

  // Invoices
  async getInvoices(page = 1, limit = 20): Promise<PaginatedResponse<Invoice>> {
    const response: AxiosResponse<PaginatedResponse<Invoice>> = await this.client.get(
      `/invoices?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getInvoice(id: string): Promise<ApiResponse<Invoice>> {
    const response: AxiosResponse<ApiResponse<Invoice>> = await this.client.get(`/invoices/${id}`);
    return response.data;
  }

  async createInvoice(invoice: Partial<Invoice>): Promise<ApiResponse<Invoice>> {
    const response: AxiosResponse<ApiResponse<Invoice>> = await this.client.post('/invoices', invoice);
    return response.data;
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<ApiResponse<Invoice>> {
    const response: AxiosResponse<ApiResponse<Invoice>> = await this.client.put(`/invoices/${id}`, invoice);
    return response.data;
  }

  // Projects
  async getProjects(page = 1, limit = 20): Promise<PaginatedResponse<Project>> {
    const response: AxiosResponse<PaginatedResponse<Project>> = await this.client.get(
      `/projects?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    const response: AxiosResponse<ApiResponse<Project>> = await this.client.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(project: Partial<Project>): Promise<ApiResponse<Project>> {
    const response: AxiosResponse<ApiResponse<Project>> = await this.client.post('/projects', project);
    return response.data;
  }

  async updateProject(id: string, project: Partial<Project>): Promise<ApiResponse<Project>> {
    const response: AxiosResponse<ApiResponse<Project>> = await this.client.put(`/projects/${id}`, project);
    return response.data;
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.client.delete(`/projects/${id}`);
    return response.data;
  }

  // Users
  async getUsers(): Promise<ApiResponse<User[]>> {
    const response: AxiosResponse<ApiResponse<User[]>> = await this.client.get('/users');
    return response.data;
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.get(`/users/${id}`);
    return response.data;
  }

  // Teams
  async getTeams(): Promise<ApiResponse<Team[]>> {
    const response: AxiosResponse<ApiResponse<Team[]>> = await this.client.get('/teams');
    return response.data;
  }

  // Assets
  async getAssets(page = 1, limit = 20): Promise<PaginatedResponse<Asset>> {
    const response: AxiosResponse<PaginatedResponse<Asset>> = await this.client.get(
      `/assets?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async createAsset(asset: Partial<Asset>): Promise<ApiResponse<Asset>> {
    const response: AxiosResponse<ApiResponse<Asset>> = await this.client.post('/assets', asset);
    return response.data;
  }

  // Locations
  async getLocations(page = 1, limit = 20): Promise<PaginatedResponse<Location>> {
    const response: AxiosResponse<PaginatedResponse<Location>> = await this.client.get(
      `/locations?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async createLocation(location: Partial<Location>): Promise<ApiResponse<Location>> {
    const response: AxiosResponse<ApiResponse<Location>> = await this.client.post('/locations', location);
    return response.data;
  }

  // Subtasks
  async getSubtasks(jobId: string): Promise<ApiResponse<Subtask[]>> {
    const response: AxiosResponse<ApiResponse<Subtask[]>> = await this.client.get(`/jobs/${jobId}/subtasks`);
    return response.data;
  }

  async createSubtask(subtask: Partial<Subtask>): Promise<ApiResponse<Subtask>> {
    const response: AxiosResponse<ApiResponse<Subtask>> = await this.client.post('/subtasks', subtask);
    return response.data;
  }

  async updateSubtask(id: string, subtask: Partial<Subtask>): Promise<ApiResponse<Subtask>> {
    const response: AxiosResponse<ApiResponse<Subtask>> = await this.client.put(`/subtasks/${id}`, subtask);
    return response.data;
  }

  // Comments
  async getComments(entityType: string, entityId: string): Promise<ApiResponse<Comment[]>> {
    const response: AxiosResponse<ApiResponse<Comment[]>> = await this.client.get(
      `/comments?entity_type=${entityType}&entity_id=${entityId}`
    );
    return response.data;
  }

  async createComment(comment: Partial<Comment>): Promise<ApiResponse<Comment>> {
    const response: AxiosResponse<ApiResponse<Comment>> = await this.client.post('/comments', comment);
    return response.data;
  }

  // Timesheets
  async getTimesheets(userId?: string, page = 1, limit = 20): Promise<PaginatedResponse<Timesheet>> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (userId) params.append('user_id', userId);
    
    const response: AxiosResponse<PaginatedResponse<Timesheet>> = await this.client.get(
      `/timesheets?${params.toString()}`
    );
    return response.data;
  }

  async createTimesheet(timesheet: Partial<Timesheet>): Promise<ApiResponse<Timesheet>> {
    const response: AxiosResponse<ApiResponse<Timesheet>> = await this.client.post('/timesheets', timesheet);
    return response.data;
  }

  async updateTimesheet(id: string, timesheet: Partial<Timesheet>): Promise<ApiResponse<Timesheet>> {
    const response: AxiosResponse<ApiResponse<Timesheet>> = await this.client.put(`/timesheets/${id}`, timesheet);
    return response.data;
  }

  // Dashboard Stats (custom endpoint - may need adjustment based on actual API)
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response: AxiosResponse<ApiResponse<DashboardStats>> = await this.client.get('/dashboard/stats');
    return response.data;
  }
}

// Export singleton instance
export const fieldPulseAPI = new FieldPulseAPI();
export default FieldPulseAPI;
