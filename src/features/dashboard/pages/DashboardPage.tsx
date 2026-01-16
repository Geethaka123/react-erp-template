import { StatsGrid } from '../components/StatsGrid';
import { RevenueChart } from '../components/RevenueChart';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* <PageHeader title="Dashboard" /> */}
      <StatsGrid />
      <div className="grid gap-4">
        <RevenueChart />
      </div>
    </div>
  );
}
