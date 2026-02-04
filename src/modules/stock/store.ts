import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RestockRequest, DashboardOverview, Product, RestockResponse } from '../../core/types';
import { API_CONFIG } from '../../core/api/config';
import { httpClient } from '../../core/api/httpClient';

export const useStockStore = defineStore('stocks', () => {
  const requests = ref<RestockRequest[]>([]);
  const restockHistory = ref<RestockRequest[]>([]);

  const products = ref<Product[]>([]);

  const overview = ref<DashboardOverview>({
    totalMerchants: 0,
    active: 0,
    lowStock: 0,
    todaySales: 0,
    restockRequests: [],
  });

  const totalRestockItems = ref(0);

  const fetchProducts = async () => {
    try {
      const result = await httpClient.get<any>(`${API_CONFIG.productApi}/products`);
      if (result.responseCode == "200" && Array.isArray(result.data)) {
        products.value = result.data;
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchRestockRequests = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await httpClient.get<any>(`${API_CONFIG.transactionApi}/admin/restock`, {
        params: {
          time_start: today as string,
          time_end: today as string
        }
      });
      if (result.responseCode == "200" && Array.isArray(result.data)) {
        requests.value = result.data;
        overview.value.restockRequests = requests.value.filter(r => r.status === 'PENDING');
      }
    } catch (error) {
      console.error('Failed to fetch restock requests:', error);
    }
  };

  const fetchAllRestockRequests = async (params: { page?: number, limit?: number, startDate?: string, endDate?: string, append?: boolean, status?: string | string[] } = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.startDate) queryParams.append('time_start', params.startDate);
      if (params.endDate) queryParams.append('time_end', params.endDate);

      if (params.status) {
        if (Array.isArray(params.status)) {
          // Join array with comma for single query param (?status=a,b)
          const statusString = params.status.join(',');
          if (statusString) {
            queryParams.append('status', statusString);
          }
        } else {
          queryParams.append('status', params.status);
        }
      }

      const queryString = queryParams.toString();
      const url = `${API_CONFIG.transactionApi}/admin/restock${queryString ? `?${queryString}` : ''}`;

      const result = await httpClient.get<any>(url);

      if (result.responseCode == "200" && Array.isArray(result.data)) {
        if (params.append) {
          requests.value = [...requests.value, ...result.data];
        } else {
          requests.value = result.data;
        }
        // Assuming the API might return total count in meta or similar, but for now strictly using what we have.
        // If the API structure for pagination is different (e.g. data wrapped in 'items'), this needs adjustment.
        // Based on current view_file of store.ts, result.data IS the array. 
        // We will store the length for now or check if there's a meta field in a real scenario.
        // For this task, I will assume the API returns the list for the page.
        // If the API supports pagination metadata, it usually comes in a separate field.
        // Given the user prompt didn't specify the response structure change, I will just proceed with setting requests.
        // I'll add a check if 'meta' exists in result just in case, but otherwise fallback.
        if (result.meta) {
          totalRestockItems.value = result.meta.totalRecord || result.meta.total || result.data.length;
        } else {
          totalRestockItems.value = result.data.length;
        }
      }
    } catch (error) {
      console.error('Failed to fetch all restock requests:', error);
    }
  };

  const processRestockRequest = async (id: string, action: 'approve' | 'reject') => {
    try {
      const result = await httpClient.patch<any>(`${API_CONFIG.transactionApi}/admin/restock/${id}`, { action });
      // If result has responseCode, check it. If body is empty ({}), treat as success since it didn't throw.
      if (result.responseCode == "200" || Object.keys(result).length === 0) {
        // Update local state instead of full refetch for better UX
        const req = requests.value.find(r => r.id === id);
        if (req) {
          req.status = action === 'approve' ? 'approved' : 'rejected';
          overview.value.restockRequests = requests.value.filter(r => r.status === 'PENDING');
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
      return false;
    }
  };

  const approveRequest = async (id: string) => {
    return await processRestockRequest(id, 'approve');
  };

  const rejectRequest = async (id: string) => {
    return await processRestockRequest(id, 'reject');
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const result = await httpClient.post<any>(`${API_CONFIG.productApi}/products`, product);
      if (result.responseCode == "201") {
        if (result.data) {
          products.value.unshift(result.data); // Add to top of list
        } else {
          await fetchProducts();
        }
      } else {
        throw new Error(result.responseMessage || 'Gagal menambahkan produk');
      }
    } catch (error: any) {
      console.error('Failed to add product:', error);
      throw error;
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      const result = await httpClient.put<any>(`${API_CONFIG.productApi}/products/${updatedProduct.id}`, updatedProduct);
      if (result.responseCode == "200") {
        await fetchProducts();
      } else {
        throw new Error(result.responseMessage || 'Gagal memperbarui produk');
      }
    } catch (error: any) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  const createStockInitiation = async (payload: any) => {
    try {
      const result = await httpClient.post<any>(`${API_CONFIG.transactionApi}/stock/create`, payload);
      if (result.responseCode != "201" && result.responseCode != "200") {
        throw new Error(result.responseMessage || 'Gagal membuat inisiasi stok');
      }
      return result;
    } catch (error: any) {
      console.error('Failed to create stock initiation:', error);
      throw error;
    }
  };

  const fetchStockHistory = async (stockMasterId: string) => {
    try {
      const result = await httpClient.get<any>(`${API_CONFIG.transactionApi}/stock/${stockMasterId}/history`);
      if (result.responseCode == "200" && Array.isArray(result.data)) {
        return result.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch stock history:', error);
      return [];
    }
  };

  const fetchAdminRestockHistory = async (date: string) => {
    try {
      const result = await httpClient.get<any>(`${API_CONFIG.transactionApi}/admin/restock/history`, { params: { date } });
      if (result.responseCode == "200" && Array.isArray(result.data)) {
        restockHistory.value = result.data;
      }
    } catch (error) {
      console.error('Failed to fetch restock history:', error);
      restockHistory.value = [];
    }
  };

  const fetchRestockDetail = async (id: string): Promise<RestockResponse | null> => {
    try {
      const result = await httpClient.get<any>(`${API_CONFIG.transactionApi}/restock/${id}`);
      if (result.responseCode == "200" && result.data) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch restock detail:', error);
      return null;
    }
  };

  return {
    requests,
    restockHistory,
    products,
    overview,
    totalRestockItems,
    fetchProducts,
    fetchRestockRequests,
    fetchAllRestockRequests,
    approveRequest,
    rejectRequest,
    addProduct,
    updateProduct,
    createStockInitiation,
    fetchStockHistory,
    fetchRestockDetail,
    fetchAdminRestockHistory
  };
});

