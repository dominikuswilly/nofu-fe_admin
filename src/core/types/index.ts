export type MerchantStatus = 'ON' | 'OFF';

export interface Merchant {
  id: string | number;
  name: string;
  phone: string;
  email: string;
  username: string;
  active: boolean;
  status: MerchantStatus;
  stock: number;
  cash: number;
  offDays: number;
  position: string;
  isPagiDone: boolean;
  isMalamDone: boolean;
  stocks?: any[]; // For raw data from API if needed
}

export interface RestockRequest {
  id: number;
  merchantId: number;
  merchantName: string;
  qty: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export interface DashboardOverview {
  totalMerchants: number;
  active: number;
  lowStock: number;
  todaySales: number;
  restockRequests: RestockRequest[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: string;
}

export interface Product {
  id: string; // Changed from number to string (UUID)
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  url: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}
