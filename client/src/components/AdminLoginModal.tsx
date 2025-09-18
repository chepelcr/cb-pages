import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
    
    console.log('Login attempt:', { email, password: '***' });
    
    // todo: remove mock functionality - Replace with AWS Cognito authentication
    // Simulate login process
    setTimeout(() => {
      if (email && password) {
        toast({
          title: "Login simulado",
          description: "En la versión final, se integrará con AWS Cognito",
        });
        console.log('Mock login successful');
        onOpenChange(false);
        setEmail('');
        setPassword('');
      } else {
        toast({
          title: "Error",
          description: "Por favor ingrese email y contraseña",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-admin-login">
        <DialogHeader className="text-center">
          <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
            <img 
              src={cbLogo} 
              alt="Cuerpo de Banderas Logo" 
              className="h-12 w-12 object-contain"
            />
          </div>
          <DialogTitle className="text-2xl font-bold" data-testid="text-login-title">
            Panel de Administración
          </DialogTitle>
          <p className="text-muted-foreground" data-testid="text-login-description">
            Acceso exclusivo para coordinadores y administradores del Cuerpo de Banderas
          </p>
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
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    data-testid="input-admin-password"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
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
            
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <Badge variant="outline" className="mb-2">Integración Futura</Badge>
              <p className="text-sm text-muted-foreground mb-2">
                Este panel se integrará con <strong>AWS Cognito</strong> para proporcionar:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Autenticación segura de administradores</li>
                <li>• Gestión de contenido y galería</li>
                <li>• Administración de información de liderazgo</li>
                <li>• Control de acceso personalizado</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}