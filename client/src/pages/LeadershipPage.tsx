import { useEffect } from 'react';
import Leadership from '@/components/Leadership';

export default function LeadershipPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-6">
      <Leadership />
    </div>
  );
}