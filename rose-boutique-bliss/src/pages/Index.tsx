import { useState, useEffect } from "react";
import { Link }    from "react-router-dom";
import { Button }  from "@/components/ui/button";
import { ArrowRight, Sparkles, Truck, Shield } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getProducts, Product } from "@/services/productService";

const Index = () => {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getProducts({ limit: 4 })
      .then((res) => setFeatured(res.products))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-accent py-24 md:py-32">
        <div className="container relative z-10 text-center">
          <p className="animate-fade-in text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Nueva Colección 2026
          </p>
          <h1 className="mt-4 animate-fade-in font-display text-5xl font-bold leading-tight text-foreground md:text-7xl [animation-delay:0.1s]">
            Elegancia que <br />
            <span className="text-primary">inspira</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md animate-fade-in text-lg text-muted-foreground [animation-delay:0.2s]">
            Descubre piezas únicas diseñadas para resaltar tu belleza y confianza.
          </p>
          <div className="mt-8 flex animate-fade-in justify-center gap-4 [animation-delay:0.3s]">
            <Button size="lg" asChild>
              <Link to="/shop">
                Explorar Tienda <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/shop">Ver Novedades</Link>
            </Button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/5" />
        <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-accent/40" />
      </section>

      {/* Trust badges */}
      <section className="border-b bg-card py-8">
        <div className="container flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { icon: Truck,    label: "Envío gratis desde $200.000" },
            { icon: Shield,   label: "Pago 100% seguro" },
            { icon: Sparkles, label: "Calidad premium" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-muted-foreground">
              <Icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Selección Destacada
            </h2>
            <p className="mt-2 text-muted-foreground">
              Piezas cuidadosamente elegidas para ti
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/shop">
                Ver toda la colección <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            ¿Lista para renovar tu estilo?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
            Únete a nuestra comunidad exclusiva y recibe acceso anticipado a nuevas colecciones y ofertas especiales.
          </p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <Link to="/shop">Comprar Ahora</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
