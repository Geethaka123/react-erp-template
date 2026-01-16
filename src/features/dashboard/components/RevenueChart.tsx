import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { date: 'Jan', Revenue: 1200, Profit: 900 },
  { date: 'Feb', Revenue: 1900, Profit: 1200 },
  { date: 'Mar', Revenue: 400, Profit: 200 },
  { date: 'Apr', Revenue: 1000, Profit: 800 },
  { date: 'May', Revenue: 800, Profit: 600 },
  { date: 'Jun', Revenue: 750, Profit: 550 },
];

export function RevenueChart() {
  return (
    <Card className="col-span-4 glass tech-border animate-in slide-in-from-bottom duration-1000 fill-mode-both delay-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold tracking-tight">System Performance</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Real-time revenue & analytical yield metrics</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Profit</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--primary)/0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card) / 0.8)', 
                  backdropFilter: 'blur(12px)',
                  borderColor: 'hsl(var(--border))', 
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
                itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '12px', fontWeight: 'bold' }}
                cursor={{ stroke: 'hsl(var(--primary)/0.2)', strokeWidth: 2 }}
              />
              <Area 
                type="monotone" 
                dataKey="Revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                animationDuration={2000}
              />
              <Area 
                type="monotone" 
                dataKey="Profit" 
                stroke="hsl(var(--primary)/0.4)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1} 
                fill="url(#colorProfit)" 
                animationDuration={2500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
