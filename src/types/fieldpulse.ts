// FieldPulse API Types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  customer_id: string;
  title: string;
  description?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  scheduled_date?: string;
  completed_date?: string;
  assigned_to?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Estimate {
  id: string;
  customer_id: string;
  job_id?: string;
  title: string;
  description?: string;
  total_amount: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'converted';
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  customer_id: string;
  job_id?: string;
  invoice_number: string;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  customer_id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on_hold';
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'technician';
  active: boolean;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: User[];
  created_at: string;
}

export interface Asset {
  id: string;
  name: string;
  category_id: string;
  description?: string;
  serial_number?: string;
  status: 'active' | 'maintenance' | 'retired';
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  job_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  entity_type: 'job' | 'customer' | 'project';
  entity_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Timesheet {
  id: string;
  user_id: string;
  job_id?: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  success: boolean;
  message?: string;
}

// Dashboard Stats
export interface DashboardStats {
  total_customers: number;
  active_jobs: number;
  pending_estimates: number;
  overdue_invoices: number;
  monthly_revenue: number;
  completion_rate: number;
}
