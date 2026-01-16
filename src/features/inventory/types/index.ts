export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Paid' | 'Pending' | 'Sent' | 'Draft';
  minStockLevel: number;
  lastUpdated: string;
  // Subscription-specific fields
  customer?: string;
  plan?: 'basic' | 'pro' | 'enterprise';
  startDate?: string;
  trialEndDate?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  subscriptionStatus?: 'trialing' | 'active' | 'canceled';
}

export type CreateInventoryItemDTO = Omit<InventoryItem, 'id' | 'lastUpdated'>;
export type UpdateInventoryItemDTO = Partial<CreateInventoryItemDTO> & { id: string };

