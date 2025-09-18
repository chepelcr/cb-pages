import { useState } from 'react';
import Header from '../Header';

export default function HeaderExample() {
  const [darkMode, setDarkMode] = useState(false);

  const handleAdminClick = () => {
    console.log('Admin panel clicked');
  };

  return (
    <Header 
      darkMode={darkMode} 
      onToggleDarkMode={() => setDarkMode(!darkMode)}
      onAdminClick={handleAdminClick}
    />
  );
}