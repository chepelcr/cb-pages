import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AdminLoginModal from '../AdminLoginModal';

export default function AdminLoginModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>Open Admin Login</Button>
      <AdminLoginModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
}