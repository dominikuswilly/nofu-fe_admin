export type MerchantStatus = 'ON' | 'OFF';

export interface Merchant {
  id: number;
  name: string;
  status: MerchantStatus;
  stock: number;
  cash: number;
  offDays: number;
  position: string;
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
