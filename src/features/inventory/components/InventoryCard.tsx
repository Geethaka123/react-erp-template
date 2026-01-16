import type { InventoryItem } from '../types';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InventoryCardProps {
  item: InventoryItem;
}

export function InventoryCard({ item }: InventoryCardProps) {
    const statusColors: Record<string, string> = {
        'Paid': 'bg-green-500',
        'In Stock': 'bg-green-500',
        'Pending': 'bg-orange-400',
        'Pending Payment': 'bg-orange-400',
        'Sent': 'bg-purple-500',
        'Low Stock': 'bg-purple-500',
        'Draft': 'bg-slate-400',
        'Out of Stock': 'bg-slate-400'
    };
    const color = statusColors[item.status] || 'bg-slate-300';

    return (
        <div className="group bg-card hover:bg-slate-50 dark:hover:bg-slate-900/40 border border-border rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col gap-4 relative">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        #{item.sku}
                    </span>
                    <h3 className="font-black text-foreground group-hover:text-primary transition-colors text-lg leading-tight">
                        {item.name}
                    </h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground -mr-2">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Status</p>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", color)} />
                        <span className="text-sm font-black text-foreground/80">{item.status}</span>
                    </div>
                </div>
                <div className="space-y-1 text-right">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Cost</p>
                    <p className="text-sm font-black text-primary">$ {item.unitPrice.toFixed(2)}</p>
                </div>
            </div>

            <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span className="text-[10px] font-medium leading-none">05 June 2024</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground justify-end">
                    <Tag className="h-3 w-3" />
                    <span className="text-[10px] font-medium leading-none">Invoice</span>
                </div>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-xl" />
        </div>
    );
}
