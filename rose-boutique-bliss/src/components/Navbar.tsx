import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, Crown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const LOGIN_URL = "https://shimmering-creation-production-008b.up.railway.app";

const navLinks = [
  { to: "/",      label: "Inicio"  },
  { to: "/shop",  label: "Tienda"  },
  { to: "/cart",  label: "Carrito" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location        = useLocation();
  const { itemCount }   = useCart();

  // Leer sesión del localStorage (la seteará el login PHP)
  const user    = (() => { try { return JSON.parse(localStorage.getItem('maleja_user') || 'null'); } catch { return null; } })();
  const isLogged = !!localStorage.getItem('maleja_token') || !!user;

  const handleLogout = () => {
    localStorage.removeItem('maleja_token');
    localStorage.removeItem('maleja_user');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetTitle className="font-display text-xl text-primary">Menú</SheetTitle>
            <nav className="mt-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
                  className={cn(
                    "text-lg font-body transition-colors hover:text-primary",
                    location.pathname === link.to && "text-primary font-semibold"
                  )}>
                  {link.label}
                </Link>
              ))}
              <Link to="/admin" onClick={() => setOpen(false)}
                className="mt-4 flex items-center gap-2 text-lg text-muted-foreground hover:text-primary">
                <Crown className="h-4 w-4" /> Admin
              </Link>
              {isLogged
                ? <button onClick={handleLogout}
                    className="flex items-center gap-2 text-lg text-muted-foreground hover:text-primary">
                    <LogOut className="h-4 w-4" /> Cerrar sesión
                  </button>
                : <a href={LOGIN_URL}
                    className="flex items-center gap-2 text-lg text-muted-foreground hover:text-primary">
                    <User className="h-4 w-4" /> Iniciar sesión
                  </a>
              }
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold tracking-wide text-primary">MALEJA'S</span>
          <span className="hidden font-display text-sm tracking-widest text-muted-foreground sm:inline">BOUTIQUE</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}
              className={cn(
                "font-body text-sm tracking-wide uppercase transition-colors hover:text-primary",
                location.pathname === link.to ? "text-primary font-semibold" : "text-muted-foreground"
              )}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">

          {/* Admin */}
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin"><Crown className="h-5 w-5" /></Link>
          </Button>

          {/* Login / Usuario */}
          {isLogged ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground md:inline">
                {user?.nombre || user?.name || 'Usuario'}
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Cerrar sesión">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" asChild title="Iniciar sesión">
              <a href={LOGIN_URL}><User className="h-5 w-5" /></a>
            </Button>
          )}

          {/* Carrito */}
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
