import { useState, useEffect } from "react";
import { Button }      from "@/components/ui/button";
import ProductCard     from "@/components/ProductCard";
import { cn }          from "@/lib/utils";
import { getProducts, getCategories, Product } from "@/services/productService";

const Shop = () => {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [active,     setActive]     = useState('Todos');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  // Cargar categorías desde la API
  useEffect(() => {
    getCategories()
      .then(cats => setCategories(['Todos', ...cats.map(c => c.name)]))
      .catch(() => setCategories(['Todos']));
  }, []);

  // Cargar productos cuando cambia la categoría
  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = active !== 'Todos' ? { category: active } : {};

    getProducts(params)
      .then(res => setProducts(res.products))
      .catch(() => setError('No se pudieron cargar los productos. Verifica que el servidor esté corriendo.'))
      .finally(() => setLoading(false));
  }, [active]);

  return (
    <div className="py-12">
      <div className="container">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-foreground">Nuestra Tienda</h1>
          <p className="mt-2 text-muted-foreground">Encuentra tu próxima pieza favorita</p>
        </div>

        {/* Filtros de categoría */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={active === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActive(cat)}
              className={cn(active === cat && "shadow-md")}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Estados */}
        {loading && (
          <div className="mt-16 text-center text-muted-foreground">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            Cargando productos...
          </div>
        )}

        {error && (
          <div className="mt-16 text-center rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
            <p className="font-medium">⚠️ {error}</p>
            <Button variant="outline" className="mt-4" onClick={() => setActive(active)}>
              Reintentar
            </Button>
          </div>
        )}

        {/* Grid de productos */}
        {!loading && !error && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">
            No hay productos en esta categoría aún.
          </p>
        )}
      </div>
    </div>
  );
};

export default Shop;
