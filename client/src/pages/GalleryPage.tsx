import { useEffect } from 'react';
import Gallery from '@/components/Gallery';

export default function GalleryPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-6">
      <Gallery />
    </div>
  );
}