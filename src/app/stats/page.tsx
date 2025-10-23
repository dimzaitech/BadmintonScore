import { StatsDashboard } from '@/components/stats-dashboard';

export default function StatsPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Statistik Pemain</h1>
      <StatsDashboard />
    </div>
  );
}
