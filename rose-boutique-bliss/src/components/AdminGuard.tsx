import { Navigate } from "react-router-dom";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('maleja_token');
  const user  = (() => {
    try { return JSON.parse(localStorage.getItem('maleja_user') || 'null'); }
    catch { return null; }
  })();

  // No está logueado
  if (!token || !user) {
    return (
      <div className="container py-24 text-center">
        <div className="mx-auto max-w-md rounded-xl border bg-card p-10 shadow-sm">
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">
            🔒 Acceso restringido
          </h1>
          <p className="text-muted-foreground mb-6">
            Debes iniciar sesión para acceder al panel de administración.
          </p>
          <a href="http://localhost:8090"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Iniciar sesión
          </a>
        </div>
      </div>
    );
  }

  // Está logueado pero no es admin
  if (user.role !== 'admin') {
    return (
      <div className="container py-24 text-center">
        <div className="mx-auto max-w-md rounded-xl border bg-card p-10 shadow-sm">
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">
            ⛔ Sin permisos
          </h1>
          <p className="text-muted-foreground mb-6">
            No tienes permisos para acceder al panel de administración.
            Solo los administradores pueden ingresar aquí.
          </p>
          <a href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Volver a la tienda
          </a>
        </div>
      </div>
    );
  }

  // Es admin — mostrar el panel
  return <>{children}</>;
};

export default AdminGuard;
