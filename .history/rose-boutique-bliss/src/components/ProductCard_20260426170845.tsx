import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge }  from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { Product } from "@/services/productService";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, loading } = useCart();

  const mainImage   = product.images?.[0] || '/placeholder.png';
  const firstVariant = product.variants?.[0];

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!firstVariant) {
      toast({ title: 'Sin variantes disponibles', variant: 'destructive' });
      return;
    }
    try {
      await addItem({
        productId: product._id,
        name:      product.name,
        price:     product.price,
        size:      firstVariant.size,
        color:     firstVariant.color,
        quantity:  1,
        image:     mainImage,
      });
      toast({ title: '¡Agregado al carrito! 🛍️', description: product.name });
    } catch {
      toast({ title: 'Inicia sesión para agregar al carrito', variant: 'destructive' });
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-muted">
        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
          {product.badges?.includes('Nuevo') && (
            <Badge className="bg-primary text-primary-foreground">Nuevo</Badge>
          )}
          {product.badges?.includes('Bestseller') && (
            <Badge variant="secondary">Bestseller</Badge>
          )}
        </div>

        {/* Imagen */}
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
          />
        </div>

        {/* Botón agregar */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            className="shadow-lg"
            onClick={handleAddToCart}
            disabled={loading}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Agregar
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <p className="text-xs text-muted-foreground">{product.category}</p>
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="font-semibold text-foreground">
          ${product.price.toLocaleString('es-CO')} COP
        </p>

        {/* Colores disponibles */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {[...new Set(product.variants.map(v => v.color))].slice(0, 4).map(color => (
              <span key={color} className="text-xs text-muted-foreground border rounded px-1">
                {color}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
