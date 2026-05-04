import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const user  = searchParams.get('user');

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        localStorage.setItem('maleja_token', token);
        localStorage.setItem('maleja_user',  JSON.stringify(userData));
      } catch {
        console.error('Error parseando datos de usuario');
      }
    }

    // Redirigir a la tienda
    window.location.href = '/';
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Iniciando sesión...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
