import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const stats = [
  { label: 'Total Revenue', value: '$54,230', icon: DollarSign, trend: '+12%', color: 'text-green-500' },
  { label: 'Active Orders', value: '1,234', icon: ShoppingBag, trend: '+5%', color: 'text-blue-500' },
  { label: 'New Customers', value: '345', icon: Users, trend: '+18%', color: 'text-purple-500' },
  { label: 'Growth', value: '24%', icon: TrendingUp, trend: '+2%', color: 'text-orange-500' },
];

interface StatsGridProps {
  isLoading?: boolean;
}

export function StatsGrid({ isLoading }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass tech-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card 
          key={stat.label} 
          className="glass tech-border group hover:bg-primary/[0.02] transition-all duration-300 animate-in zoom-in-95 fade-in duration-500 fill-mode-both"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
              {stat.label}
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tighter text-foreground">{stat.value}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded-full bg-background/50 border", 
                stat.trend.startsWith('+') ? "text-primary border-primary/20" : "text-destructive border-destructive/20"
              )}>
                {stat.trend}
              </span>
              <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-medium">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
