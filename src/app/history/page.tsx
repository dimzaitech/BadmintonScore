import { HistoryList } from '@/components/history-list';

export default function HistoryPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Match History</h1>
      <HistoryList />
    </div>
  );
}
