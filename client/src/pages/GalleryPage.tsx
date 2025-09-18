import { useEffect } from 'react';
import Gallery from '@/components/Gallery';
import PageTransition from '@/components/PageTransition';

export default function GalleryPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-6">
        <Gallery />
      </div>
    </PageTransition>
  );
}