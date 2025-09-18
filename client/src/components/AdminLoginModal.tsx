import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signIn, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import cbLogo from '@assets/cb logo_1758164197769.png';

interface AdminLoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminLoginModal({ isOpen, onOpenChange }: AdminLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Admin login attempt - Development mode');
    
    try {
      // For development purposes - simple login success
      // TODO: Replace with AWS Amplify authentication in production
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "¡Acceso autorizado!",
        description: "Bienvenido al panel administrativo del Cuerpo de Banderas (Modo Desarrollo)",
      });
      
      console.log('Development login successful');
      onOpenChange(false);
      setEmail('');
      setPassword('');
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      toast({
        title: "Error de autenticación",
        description: "Error inesperado en el sistema",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border" data-testid="modal-admin-login">
        <DialogHeader className="text-center">
          <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
            <img 
              src={cbLogo} 
              alt="Cuerpo de Banderas Logo" 
              className="h-12 w-12 object-contain"
            />
          </div>
          <DialogTitle className="text-2xl font-bold text-center" data-testid="text-login-title">
            Panel de Administración
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@liceocostarica.ed.cr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    data-testid="input-admin-email"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingrese su contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 rounded-r-none border-r-0"
                      data-testid="input-admin-password"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-l-none border-l-0"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full hover-elevate" 
                disabled={isLoading || !email || !password}
                data-testid="button-admin-login"
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <Badge variant="outline" className="mb-2 border-green-500 text-green-700 dark:text-green-300">
                🚀 Modo Desarrollo Activo
              </Badge>
              <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                <strong>Acceso de desarrollo habilitado:</strong>
              </p>
              <ul className="text-xs text-green-600 dark:text-green-400 space-y-1">
                <li>• ✅ Ingrese cualquier email y contraseña</li>
                <li>• ✅ Acceso inmediato al panel de administración</li>
                <li>• ⏳ AWS Amplify configurado para producción futura</li>
              </ul>
              <p className="text-xs text-green-500 dark:text-green-400 mt-2">
                <em>Ideal para desarrollo y pruebas</em>
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}