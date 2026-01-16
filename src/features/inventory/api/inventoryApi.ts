import type { InventoryItem, CreateInventoryItemDTO, UpdateInventoryItemDTO } from '../types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock Data - Subscription focused
const MOCK_INVENTORY: InventoryItem[] = [
  { 
    id: '1', 
    sku: 'SUB-001', 
    name: 'Acme Corporation', 
    customer: 'Acme Corporation',
    category: 'Subscription', 
    quantity: 1, 
    unitPrice: 499.00, 
    status: 'Paid', 
    minStockLevel: 0, 
    lastUpdated: '2024-03-10',
    plan: 'enterprise',
    startDate: '2024-01-01',
    trialEndDate: '2024-01-15',
    currentPeriodStart: '2024-03-01',
    currentPeriodEnd: '2024-03-31',
    subscriptionStatus: 'active',
    
  },
  { 
    id: '2', 
    sku: 'SUB-002', 
    name: 'TechStart Inc', 
    customer: 'TechStart Inc',
    category: 'Subscription', 
    quantity: 1, 
    unitPrice: 99.00, 
    status: 'Pending', 
    minStockLevel: 0, 
    lastUpdated: '2024-03-12',
    plan: 'pro',
    startDate: '2024-02-01',
    trialEndDate: '2024-02-15',
    currentPeriodStart: '2024-03-01',
    currentPeriodEnd: '2024-03-31',
    subscriptionStatus: 'trialing'
  },
  { 
    id: '3', 
    sku: 'SUB-003', 
    name: 'Global Solutions Ltd', 
    customer: 'Global Solutions Ltd',
    category: 'Subscription', 
    quantity: 1, 
    unitPrice: 29.00, 
    status: 'Paid', 
    minStockLevel: 0, 
    lastUpdated: '2024-03-15',
    plan: 'basic',
    startDate: '2024-01-15',
    currentPeriodStart: '2024-03-15',
    currentPeriodEnd: '2024-04-15',
    subscriptionStatus: 'active'
  },
  { 
    id: '4', 
    sku: 'SUB-004', 
    name: 'Innovation Labs', 
    customer: 'Innovation Labs',
    category: 'Subscription', 
    quantity: 1, 
    unitPrice: 499.00, 
    status: 'Draft', 
    minStockLevel: 0, 
    lastUpdated: '2024-03-08',
    plan: 'enterprise',
    startDate: '2024-04-01',
    subscriptionStatus: 'trialing'
  },
  { 
    id: '5', 
    sku: 'SUB-005', 
    name: 'Digital Ventures1', 
    customer: 'Digital Ventures1',
    category: 'Subscription', 
    quantity: 1, 
    unitPrice: 99.00, 
    status: 'Sent', 
    minStockLevel: 0, 
    lastUpdated: '2024-03-14',
    plan: 'pro',
    startDate: '2024-03-01',
    trialEndDate: '2024-03-15',
    currentPeriodStart: '2024-03-01',
    currentPeriodEnd: '2024-03-31',
    subscriptionStatus: 'active'
  },
];

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InventoryFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: Record<string, string>;
}

export const inventoryApi = {
  getAll: async (filters: InventoryFilters = {}): Promise<PaginatedResponse<InventoryItem>> => {
    const { page = 1, limit = 8, status, search } = filters;
    
    // Simulate delay
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...MOCK_INVENTORY];

        // Apply Status Filter
        if (status && status !== 'View all') {
          filtered = filtered.filter(item => item.status === status);
        }

        // Apply Search Filters
        if (search) {
          filtered = filtered.filter(item => {
            return Object.entries(search).every(([key, value]) => {
              if (!value) return true;
              if (key === 'sku') return item.sku.toLowerCase().includes(value.toLowerCase());
              if (key === 'name' || key === 'initials') return item.name.toLowerCase().includes(value.toLowerCase());
              return true;
            });
          });
        }

        const total = filtered.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const data = filtered.slice(start, start + limit);

        resolve({
          data,
          total,
          page,
          limit,
          totalPages: totalPages || 1
        });
      }, 800);
    });
  },

  create: async (data: CreateInventoryItemDTO): Promise<InventoryItem> => {
    return new Promise((resolve) => {
      const newItem: InventoryItem = {
        
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      MOCK_INVENTORY.push(newItem);
      setTimeout(() => resolve(newItem), 800);
    });
  },

  update: async (data: UpdateInventoryItemDTO): Promise<InventoryItem> => {
    return new Promise((resolve, reject) => {
      console.log('Updating item:', data);
      const index = MOCK_INVENTORY.findIndex(item => item.id === data.id);
      if (index === -1) {
        reject(new Error('Item not found'));
        return;
      }

      const updatedItem = {
        ...MOCK_INVENTORY[index],
        ...data,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      MOCK_INVENTORY[index] = updatedItem;
      setTimeout(() => resolve(updatedItem), 800);
    });
  },

  delete: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const index = MOCK_INVENTORY.findIndex(item => item.id === id);
      if (index === -1) {
        reject(new Error('Item not found'));
        return;
      }

      MOCK_INVENTORY.splice(index, 1);
      setTimeout(() => resolve(), 800);
    });
  },

  getSuggestions: async (query: string): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions = MOCK_INVENTORY
          .map(item => item.customer || item.name)
          .filter(name => name.toLowerCase().includes(query.toLowerCase()));
        
        const uniqueSuggestions = Array.from(new Set(suggestions));
        resolve(uniqueSuggestions);
      }, 300);
    });
  },
};

export function useInventory(filters: InventoryFilters = {}) {
  return useQuery({
    queryKey: ['inventory', filters],
    queryFn: () => inventoryApi.getAll(filters),
  });
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    
    mutationFn: inventoryApi.create,
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useInventorySuggestions(query: string) {
  return useQuery({
    queryKey: ['inventory', 'suggestions', query],
    queryFn: async () => {
      const data = await inventoryApi.getSuggestions(query);
      
      return data;
    },
    // Set to true to allow showing all customers initially
    enabled: true,
  });
}




