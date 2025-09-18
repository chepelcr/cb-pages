import { useEffect } from 'react';
import Shields from '@/components/Shields';

export default function ShieldsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-6">
      <Shields />
    </div>
  );
}