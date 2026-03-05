
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, AlertCircle, Building2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const { user, loading, signIn, enterPresentationMode } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handlePresentationMode = () => {
    enterPresentationMode();
    navigate('/', { replace: true });
  };

  // Redirecionar se já estiver logado
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    const { error } = await signIn(loginData.email, loginData.password, () => {
      console.log('🏠 Redirecionando para home após login bem-sucedido');
      navigate('/', { replace: true });
    });

    if (error) {
      if (error.message === 'Email not confirmed') {
        setLoginError('Email não confirmado. Verifique sua caixa de entrada ou contate o administrador.');
      } else if (error.message === 'Invalid login credentials') {
        setLoginError('Email ou senha incorretos.');
      } else {
        setLoginError(error.message || 'Erro no login. Tente novamente.');
      }
    }

    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-100">GESTÃO COM IA</CardTitle>
          <CardDescription className="text-slate-400">
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-slate-300">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                className="bg-slate-700 border-slate-600 text-slate-100"
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-slate-300">Senha</Label>
              <Input
                id="login-password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                className="bg-slate-700 border-slate-600 text-slate-100"
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4 mr-2" />
              )}
              Entrar
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-400">Ou</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/onboarding')}
            className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300 mt-2"
          >
            <Building2 className="h-4 w-4 mr-2" />
            CADASTRAR EMPRESA
          </Button>

        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
