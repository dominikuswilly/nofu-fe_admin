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

export interface RestockDetailItem {
  id: string;
  productName: string;
  productId: string;
  productImageUrl: string;
  qty: number;
}

export interface RestockResponse {
  id: string;
  totalQty: number;
  totalItem: number;
  status: string;
  location: {
    longitude: number;
    latitude: number;
  };
  restockDetail: RestockDetailItem[];
}

export interface RestockRequest {
  id: string;
  merchantId: string;
  merchantName?: string;
  qty?: number | string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  longitude?: number;
  latitude?: number;
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
