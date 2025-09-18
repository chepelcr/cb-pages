import { useEffect } from 'react';
import Shields from '@/components/Shields';
import PageTransition from '@/components/PageTransition';

export default function ShieldsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-6">
        <Shields />
      </div>
    </PageTransition>
  );
}