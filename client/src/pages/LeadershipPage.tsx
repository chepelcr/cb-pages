import { useEffect } from 'react';
import Leadership from '@/components/Leadership';
import PageTransition from '@/components/PageTransition';

export default function LeadershipPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-6">
        <Leadership />
      </div>
    </PageTransition>
  );
}