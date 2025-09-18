import { useEffect } from 'react';
import History from '@/components/History';

export default function HistoryPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-6">
      <History />
    </div>
  );
}