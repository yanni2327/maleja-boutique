import { Link }        from "react-router-dom";
import { Badge }        from "@/components/ui/badge";
import { Button }       from "@/components/ui/button";
import { ShoppingBag }  from "lucide-react";
import { useCart }      from "@/context/CartContext";
import { Product }      from "@/services/productService";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const mainImage    = product.images?.[0] || "https://placehold.co/400x500?text=Sin+imagen";
  const firstVariant = product.variants?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!firstVariant) return;
    addItem({
      productId: product._id,
      name:      product.name,
      price:     product.price,
      size:      firstVariant.size,
      color:     firstVariant.color,
      quantity:  1,
      image:     mainImage,
    });
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={mainImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/400x500?text=Sin+imagen";
          }}
        />

        <div className="absolute left-3 top-3 flex gap-2">
          {product.badges?.includes("Nuevo") && (
            <Badge className="bg-primary text-primary-foreground">Nuevo</Badge>
          )}
          {product.badges?.includes("Bestseller") && (
            <Badge variant="secondary">Bestseller</Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <Button size="sm" className="shadow-lg" onClick={handleAddToCart}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Agregar
          </Button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.category}</p>
        <h3 className="mt-1 font-display text-lg font-semibold text-foreground">{product.name}</h3>
        <p className="mt-2 text-lg font-semibold text-primary">
          ${product.price.toLocaleString("es-CO")} COP
        </p>
        {product.variants?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {[...new Set(product.variants.map((v) => v.color))].slice(0, 3).map((color) => (
              <span key={color} className="rounded border px-1.5 py-0.5 text-xs text-muted-foreground">
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
