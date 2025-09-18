import { ThemeProvider, useTheme } from '../ThemeProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sun, Moon } from 'lucide-react';

function ThemeToggleExample() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Card className="p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-4">Theme Provider Example</h3>
      <p className="text-muted-foreground mb-4">Current theme: <strong>{theme}</strong></p>
      <Button onClick={toggleTheme} className="flex items-center gap-2">
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </Button>
    </Card>
  );
}

export default function ThemeProviderExample() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="p-8 bg-background text-foreground min-h-screen">
        <ThemeToggleExample />
      </div>
    </ThemeProvider>
  );
}