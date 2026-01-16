import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';

interface Customer {
  id: string;
  name: string;
  phone: string;
  status: 'Open' | 'Paid' | 'Inactive';
  rate: number;
  balance: number;
  deposit: number;
}

const mockCustomers: Customer[] = [
  { id: '1', name: 'Ralph Edwards', phone: '(405) 555-0128', status: 'Open', rate: 78.00, balance: -105.55, deposit: 293.01 },
  { id: '2', name: 'Floyd Miles', phone: '(480) 555-0103', status: 'Paid', rate: 40.00, balance: 275.43, deposit: 710.68 },
  { id: '3', name: 'Darlene Robertson', phone: '(808) 555-0111', status: 'Open', rate: 77.00, balance: -778.35, deposit: 169.43 },
  { id: '4', name: 'Albert Flores', phone: '(316) 555-0116', status: 'Inactive', rate: 85.00, balance: 928.41, deposit: 779.58 },
  { id: '5', name: 'Devon Lane', phone: '(217) 555-0113', status: 'Paid', rate: 56.00, balance: 256.35, deposit: 896.65 },
];

export function CustomersPage() {
  const columns = [
    { key: 'name' as keyof Customer, label: 'Customer', render: (item: Customer) => (
      <div className="space-y-1">
        <div className="text-sm font-bold text-blue-950 dark:text-blue-50">{item.name}</div>
        <p className="text-xs text-muted-foreground">{item.phone}</p>
      </div>
    )},
    { key: 'status' as keyof Customer, label: 'Status', render: (item: Customer) => {
      const colors = {
        Open: 'bg-[#f0f4ff] text-[#4c6ef5] border-[#e0e7ff] dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800/50',
        Paid: 'bg-[#ebfbee] text-[#40c057] border-[#d3f9d8] dark:bg-green-900/40 dark:text-green-300 dark:border-green-800/50',
        Inactive: 'bg-blue-50/50 text-blue-400 border-blue-100/50 dark:bg-blue-950/40 dark:text-blue-500 dark:border-blue-800/30'
      };
      
      return (
        <span className={cn(
          "px-5 py-1 rounded-full text-[11px] font-bold border",
          colors[item.status]
        )}>
          {item.status}
        </span>
      );
    }},
    { key: 'rate' as keyof Customer, label: 'Rate', render: (item: Customer) => (
      <div className="space-y-1">
        <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
          ${item.rate.toFixed(2)}
        </div>
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">USD</p>
      </div>
    )},
    { key: 'balance' as keyof Customer, label: 'Balance', render: (item: Customer) => (
      <div className="space-y-1">
        <div className={cn(
          "text-sm font-medium",
          item.balance < 0 ? "text-rose-500" : "text-emerald-500"
        )}>
          {item.balance < 0 ? '-' : ''}${Math.abs(item.balance).toFixed(2)}
        </div>
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">USD</p>
      </div>
    )},
    { key: 'deposit' as keyof Customer, label: 'Deposit', render: (item: Customer) => (
      <div className="space-y-1">
        <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
          ${item.deposit.toFixed(2)}
        </div>
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">USD</p>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" />
      <DataTable data={mockCustomers} columns={columns} />
    </div>
  );
}
