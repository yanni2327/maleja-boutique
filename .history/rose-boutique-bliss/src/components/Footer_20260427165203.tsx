import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-secondary/30 py-12">
    <div className="container grid gap-8 md:grid-cols-3">
      <div>
        <h3 className="font-display text-xl font-bold text-primary">MALEJA'S BOUTIQUE</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Moda femenina con estilo y elegancia. Tu destino glamouroso para vestir con confianza.
        </p>
      </div>
      <div>
        <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
          Navegación
        </h4>
        <nav className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          <Link to="/shop" className="hover:text-primary">Tienda</Link>
          <Link to="/cart" className="hover:text-primary">Carrito</Link>
        </nav>
      </div>
      <div>
        <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
          Contacto
        </h4>
        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <p>mwomenboutique@gmail.com</p>
          <p>+57 314 333 2898</p>
          <p>Colombia</p>
        </div>
      </div>
    </div>
    <div className="container mt-8 flex items-center justify-center gap-1 border-t pt-6 text-xs text-muted-foreground">
      Hecho con <Heart className="h-3 w-3 fill-primary text-primary" /> por Maleja's Boutique © 2026
    </div>
  </footer>
);

export default Footer;
