import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { useInventory, useCreateInventoryItem, useUpdateInventoryItem, useDeleteInventoryItem, useInventorySuggestions } from '../api/inventoryApi';
import type { InventoryItem } from '../types';
import { ItemModal } from '../components/ItemModal';
import { PageHeader } from '@/components/ui/PageHeader';
import { ViewControls } from '@/components/ui/ViewControls';
import { AdvancedSearch, type SearchField } from '@/components/ui/AdvancedSearch';
import { InventoryCard } from '../components/InventoryCard';
import { StatusFilter } from '@/components/ui/StatusFilter';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { Plus, Import, CreditCard, Activity, RefreshCcw, Search, Pencil, Trash2 } from 'lucide-react';
import { type FieldConfig } from '@/components/ui/AppFormField';
import { notificationService } from '@/utils/notifications';

const FIELD_NAMES = {
  customer: 'customer',
  plan: 'plan',
  startDate: 'startDate',
  trialEndDate: 'trialEndDate',
  currentPeriodStart: 'currentPeriodStart',
  currentPeriodEnd: 'currentPeriodEnd',
  status: 'status',
  subscriptionStatus: 'subscriptionStatus',
} as const;

type SubscriptionFormValues = {
  [K in keyof typeof FIELD_NAMES]: string;
};



const PLAN_LABELS: Record<string, string> = {
  'basic': 'Basic',
  'pro': 'Pro',
  'enterprise': 'Enterprise'
};

const STATUS_COLORS: Record<string, string> = {
  'Paid': 'bg-green-500',
  'In Stock': 'bg-green-500',
  'Pending': 'bg-orange-400',
  'Pending Payment': 'bg-orange-400',
  'Sent': 'bg-purple-500',
  'Low Stock': 'bg-purple-500',
  'Draft': 'bg-slate-400',
  'Out of Stock': 'bg-slate-400'
};

const SUB_STATUS_COLORS: Record<string, string> = {
  'active': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'trialing': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'canceled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};

// Initial values for the form
const SUBSCRIPTION_DEFAULT_VALUES = {
  customer: '',
  plan: '',
  startDate: new Date().toISOString().split('T')[0],
  trialEndDate: '',
  currentPeriodStart: '',
  currentPeriodEnd: '',
  status: '',
  subscriptionStatus: ''
};

const getSubscriptionDefaultValues = (item: InventoryItem | null): SubscriptionFormValues => {
  if (!item) return SUBSCRIPTION_DEFAULT_VALUES;
  
  return {
    customer: item.customer || item.name,
    plan: item.plan || '',
    startDate: item.startDate || '',
    trialEndDate: item.trialEndDate || '',
    currentPeriodStart: item.currentPeriodStart || '',
    currentPeriodEnd: item.currentPeriodEnd || '',
    status: item.status === 'In Stock' || item.status === 'Paid' ? 'active' : 'inactive',
    subscriptionStatus: item.subscriptionStatus || ''
  };
};

const calculateUnitPrice = (plan: string) => {
  switch (plan) {
    case 'enterprise': return 499.00;
    case 'pro': return 99.00;
    default: return 29.00;
  }
};

const STATUS_OPTIONS = ['View all', 'Paid', 'Pending', 'Sent', 'Draft'];


export function InventoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('View all');
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);


  const { data: response, isLoading } = useInventory({
    page: currentPage,
    limit: 8,
    status: statusFilter,
    search: searchValues
  });

  const { data: customerSuggestions, isLoading: isLoadingSuggestions } = useInventorySuggestions("");
  const createItemMutation = useCreateInventoryItem();
  const updateItemMutation = useUpdateInventoryItem();
  const deleteItemMutation = useDeleteInventoryItem();


  const searchFields: SearchField[] = useMemo(() => [
    { id: 'sku', label: 'Account No', placeholder: 'e.g. INV-001' },
    { id: 'name', label: 'Customer Name', placeholder: 'e.g. John Doe' },
    { id: 'minAmount', label: 'Min Amount', type: 'number', placeholder: '0.00' },
    { 
      id: 'department', 
      label: 'Department', 
      type: 'autocomplete', 
      isLoading: isLoadingSuggestions,
      placeholder: 'Select department',
      options: (customerSuggestions || []).map(c => ({ label: c, value: c })),
    },
  ], [customerSuggestions, isLoadingSuggestions]);

  const handleSearch = (values: Record<string, string>) => {
    setSearchValues(values);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const subscriptionFieldConfigs = useMemo((): FieldConfig<SubscriptionFormValues>[] => [
    {
      name: 'customer',
      label: 'Customer',
      type: 'combobox',
      icon: Search,
      placeholder: 'Select customer...',
      options: (customerSuggestions || []).map(c => ({ label: c, value: c })),
      validation: z.string().min(1, 'Customer name is required'),
      isLoading: isLoadingSuggestions
    },
    {
      name: 'plan',
      label: 'Plan',
      type: 'select',
      icon: CreditCard,
      placeholder: 'Select Plan',
      options: [
        { label: <div className="flex items-center gap-2"><span className="font-medium">Basic Plan</span><span className="text-muted-foreground text-xs">$29/mo</span></div>, value: 'basic' },
        { label: <div className="flex items-center gap-2"><span className="font-medium">Pro Plan</span><span className="text-muted-foreground text-xs">$99/mo</span></div>, value: 'pro' },
        { label: <div className="flex items-center gap-2"><span className="font-medium">Enterprise</span><span className="text-muted-foreground text-xs">$499/mo</span></div>, value: 'enterprise' }
      ],
      validation: z.string().min(1, 'Plan is required')
    },
    { 
      name: 'startDate', 
      label: 'Start Date', 
      type: 'date', 
      placeholder: 'Select start date',
      validation: z.string().min(1, 'Start date is required')
    },
    { name: 'trialEndDate', label: 'Trial End Date', type: 'date', placeholder: 'Select trial end date', validation: z.string().optional() },
    { name: 'currentPeriodStart', label: 'Current Period Start', type: 'date', placeholder: 'Select period start', validation: z.string().optional() },
    { name: 'currentPeriodEnd', label: 'Current Period End', type: 'date', placeholder: 'Select period end', validation: z.string().optional() },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      icon: Activity,
      placeholder: 'Select Status',
      options: [
        { label: <span className="flex items-center gap-2 text-green-600"><span className="w-2 h-2 rounded-full bg-green-600" /> Active</span>, value: 'active' },
        { label: <span className="flex items-center gap-2 text-slate-500"><span className="w-2 h-2 rounded-full bg-slate-500" /> Inactive</span>, value: 'inactive' },
        { label: <span className="flex items-center gap-2 text-orange-500"><span className="w-2 h-2 rounded-full bg-orange-500" /> Pending</span>, value: 'pending' }
      ],
      validation: z.string().min(1, 'Status is required')
    },
    {
      name: 'subscriptionStatus',
      label: 'Subscription Status',
      type: 'select',
      icon: RefreshCcw,
      placeholder: 'Select Sub Status',
      options: [
        { label: 'Trialing', value: 'trialing' },
        { label: 'Active', value: 'active' },
        { label: 'Canceled', value: 'canceled' }
      ],
      validation: z.string().optional()
    }
  ], [customerSuggestions, isLoadingSuggestions]);


  const columns = useMemo(() => [
    { key: 'sku' as keyof InventoryItem, label: 'Account No', render: (item: InventoryItem) => (
      <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors cursor-pointer capitalize">#{item.sku.toLowerCase()}</span>
    )},
    { key: 'name' as keyof InventoryItem, label: 'Customer', render: (item: InventoryItem) => (
      <span className="font-medium text-slate-900 dark:text-slate-100">{item.customer || item.name}</span>
    )},
    { key: 'plan' as keyof InventoryItem, label: 'Plan', render: (item: InventoryItem) => (
      <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700 dark:text-slate-300">{PLAN_LABELS[item.plan || ''] || '-'}</span>
          <span className="text-xs text-muted-foreground">${item.unitPrice.toFixed(2)}/mo</span>
      </div>
    )},
    { key: 'status' as keyof InventoryItem, label: 'Status', render: (item: InventoryItem) => {
        const color = STATUS_COLORS[item.status] || 'bg-slate-300';
        return (
            <div className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", color)} />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.status}</span>
            </div>
        );
    }},
    { key: 'subscriptionStatus' as keyof InventoryItem, label: 'Subscription', render: (item: InventoryItem) => {
        const status = item.subscriptionStatus || '-';
        const colorClass = SUB_STATUS_COLORS[status] || 'bg-slate-100 text-slate-700';
        return status !== '-' ? (
            <span className={cn("px-2 py-1 rounded-md text-xs font-semibold capitalize", colorClass)}>
                {status}
            </span>
        ) : <span className="text-slate-400">-</span>;
    }},
    { key: 'startDate', label: 'Start Date', render: (item: InventoryItem) => (
        <span className="text-sm text-slate-600 dark:text-slate-400">{item.startDate || '-'}</span>
    )},
    { key: 'currentPeriodEnd', label: 'Period End', render: (item: InventoryItem) => (
        <span className="text-sm text-slate-600 dark:text-slate-400">{item.currentPeriodEnd || '-'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (item: InventoryItem) => (
      <div className="flex items-center gap-2">
        <Pencil 
          className="h-4 w-4 text-slate-400 cursor-pointer hover:text-primary transition-colors" 
          onClick={(e) => {
            e.stopPropagation();
            setEditingItem(item);
          }}
        />
        <Trash2 
          className="h-4 w-4 text-slate-400 cursor-pointer hover:text-red-500 transition-colors" 
          onClick={(e) => {
            e.stopPropagation();
            // if (confirm('Are you sure you want to delete this subscription?')) {
              deleteItemMutation.mutate(item.id, {
                onSuccess: () => {
                  notificationService.success('Subscription Deleted', 'The subscription has been successfully removed.');
                },
                onError: (error) => {
                  notificationService.error('Delete Failed', error instanceof Error ? error.message : 'Could not delete subscription');
                }
              });
            // }
          }}
        />
      </div>
    )},
  ], []);

  const handleSubscriptionSubmit = useCallback(async (values: SubscriptionFormValues) => {
    try {
      const commonData = {
        name: values.customer,
        customer: values.customer,
        plan: values.plan as InventoryItem['plan'],
        startDate: values.startDate,
        trialEndDate: values.trialEndDate,
        currentPeriodStart: values.currentPeriodStart,
        currentPeriodEnd: values.currentPeriodEnd,
        status: (values.status === 'active' ? 'In Stock' : 'Out of Stock') as InventoryItem['status'],
        subscriptionStatus: values.subscriptionStatus as InventoryItem['subscriptionStatus']
      };

      if (editingItem) {
        await updateItemMutation.mutateAsync({
          id: editingItem.id,
          ...commonData
        });
        notificationService.success('Subscription Updated', 'The subscription has been updated successfully.');
      } else {
        await createItemMutation.mutateAsync({
          ...commonData,
          sku: `SUB-${Math.floor(Math.random() * 10000)}`,
          quantity: 1,
          unitPrice: calculateUnitPrice(values.plan),
          category: 'Subscription',
          minStockLevel: 0
        });
        notificationService.success('Subscription Created', 'New subscription has been added successfully.');
      }
      setIsCreateModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to submit subscription:', error);
      notificationService.error('Submission Failed', error instanceof Error ? error.message : 'Could not save subscription');
    }
  }, [editingItem, updateItemMutation, createItemMutation]);

  return (
    <div className="border border-border/60 rounded-2xl shadow-sm transition-all duration-300">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both p-6 md:p-8 lg:p-10">
        <PageHeader 
          title="Invoices" 
          description="Track and manage all billing transactions and invoice statuses efficiently."
        >
          <div className="flex items-center gap-3">
            {/* <Button variant="outline" className="text-foreground bg-card border-border font-bold shadow-xs">
                <Import className="mr-2 h-4 w-4" /> Import
            </Button> */}
            <Button onClick={() => setIsCreateModalOpen(true)} className="font-black bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> Add project
            </Button>
          </div>
        </PageHeader>

        <AdvancedSearch 
          fields={searchFields} 
          onSearch={handleSearch} 
          onReset={() => handleSearch({})}
        />
        
        {/* Table Filters & View Toggle */}
        <div className="flex wrap items-center justify-between gap-4 py-2">
          <StatusFilter 
              options={STATUS_OPTIONS} 
              currentValue={statusFilter} 
              onChange={handleStatusChange} 
          />
          <ViewControls 
              viewMode={viewMode} 
              onViewToggle={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
          />
        </div>

        <DataTable 
            data={response?.data || []} 
            columns={columns} 
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={response?.totalPages || 1}
            onPageChange={setCurrentPage}
            viewMode={viewMode}
            renderCard={(item: InventoryItem) => <InventoryCard item={item} />}
        />

        <ItemModal<SubscriptionFormValues>
          isOpen={isCreateModalOpen || !!editingItem} 
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingItem(null);
          }}
          title={
            <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Invoices</span>
                <span className="text-2xl font-black text-foreground normal-case tracking-tight">
                  {editingItem ? 'Edit Subscription' : 'Create Subscription'}
                </span>
            </div>
          }
          description={editingItem ? "Update subscription details and billing periods." : "Manage subscription details and billing periods."}
          fieldConfigs={subscriptionFieldConfigs}
          defaultValues={getSubscriptionDefaultValues(editingItem)}
          onSubmit={handleSubscriptionSubmit}
          isLoading={createItemMutation.isPending || updateItemMutation.isPending}
        />
      </div>
    </div>
  );
}



