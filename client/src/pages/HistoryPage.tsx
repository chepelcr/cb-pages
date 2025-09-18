import { useEffect } from 'react';
import History from '@/components/History';
import PageTransition from '@/components/PageTransition';

export default function HistoryPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-6">
        <History />
      </div>
    </PageTransition>
  );
}