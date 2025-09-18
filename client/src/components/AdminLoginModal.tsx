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
    
    console.log('Admin login attempt via AWS Amplify:', { email, password: '***' });
    
    try {
      // Authenticate with AWS Amplify
      const authResult = await signIn({
        username: email,
        password: password,
      });

      console.log('Amplify authentication result:', authResult);

      // After successful Amplify login, call profile endpoint
      if (authResult.isSignedIn) {
        // Get authenticated user and session for proper user ID and token
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        const userId = currentUser.userId; // Proper Cognito user ID (sub)
        const idToken = session.tokens?.idToken?.toString();
        
        // Call backend profile endpoint with authentication
        const response = await fetch(`/api/users/${userId}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          const userProfile = await response.json();
          toast({
            title: "¡Acceso autorizado!",
            description: `Bienvenido ${userProfile.firstName || userProfile.userName}`,
          });
          console.log('User profile loaded:', userProfile);
          onOpenChange(false);
          setEmail('');
          setPassword('');
        } else {
          // If profile doesn't exist, that's OK for now
          toast({
            title: "¡Acceso autorizado!",
            description: "Bienvenido al panel administrativo del Cuerpo de Banderas",
          });
          onOpenChange(false);
          setEmail('');
          setPassword('');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "Error de autenticación";
      if (error.name === 'NotAuthorizedException') {
        errorMessage = "Credenciales inválidas";
      } else if (error.name === 'UserNotConfirmedException') {
        errorMessage = "Usuario no confirmado. Verifique su email.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error de autenticación",
        description: errorMessage,
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
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <Badge variant="outline" className="mb-2 border-blue-500 text-blue-700 dark:text-blue-300">
                🔧 AWS Amplify Setup Required
              </Badge>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                <strong>Authentication flow configured:</strong>
              </p>
              <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                <li>• 🔧 AWS Amplify frontend authentication</li>
                <li>• 🔧 JWT token backend verification</li>
                <li>• 🔧 Profile endpoint with proper auth</li>
                <li>• 📧 Email verification available</li>
              </ul>
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">
                <em>Note: Requires AWS Cognito configuration</em>
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}