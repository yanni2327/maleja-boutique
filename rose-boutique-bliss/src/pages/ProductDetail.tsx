import { useParams, Link }  from "react-router-dom";
import { useState, useEffect } from "react";
import { Button }  from "@/components/ui/button";
import { Badge }   from "@/components/ui/badge";
import { ShoppingBag, ArrowLeft, Heart, Loader2 } from "lucide-react";
import { cn }      from "@/lib/utils";
import { toast }   from "sonner";
import { getProductById, Product, ProductVariant } from "@/services/productService";
import { useCart } from "@/context/CartContext";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem, loading: cartLoading } = useCart();

  const [product,       setProduct]       = useState<Product | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [selectedSize,  setSelectedSize]  = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [mainImage,     setMainImage]     = useState<string>('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setMainImage(data.images?.[0] || '');
        if (data.variants?.length > 0) {
          setSelectedSize(data.variants[0].size);
          setSelectedColor(data.variants[0].color);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const sizes  = [...new Set(product?.variants?.map(v => v.size)  || [])];
  const colors = [...new Set(product?.variants?.map(v => v.color) || [])];

  const selectedVariant = product?.variants?.find(
    v => v.size === selectedSize && v.color === selectedColor
  );

  const handleAddToCart = async () => {
    if (!product) return;
    if (!selectedSize)  { toast.error("Selecciona una talla");  return; }
    if (!selectedColor) { toast.error("Selecciona un color");   return; }

    try {
      await addItem({
        productId: product._id,
        name:      product.name,
        price:     product.price,
        size:      selectedSize,
        color:     selectedColor,
        quantity:  1,
        image:     mainImage,
      });
      toast.success(`¡${product.name} agregado al carrito! 🛍️`);
    } catch {
      toast.error("Inicia sesión para agregar al carrito");
    }
  };

  if (loading) return (
    <div className="container py-24 text-center text-muted-foreground">
      <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
      Cargando producto...
    </div>
  );

  if (!product) return (
    <div className="container py-24 text-center">
      <h1 className="font-display text-2xl text-foreground">Producto no encontrado</h1>
      <Button variant="outline" className="mt-4" asChild>
        <Link to="/shop"><ArrowLeft className="mr-2 h-4 w-4" /> Volver a la tienda</Link>
      </Button>
    </div>
  );

  return (
    <div className="py-12">
      <div className="container">
        <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground" asChild>
          <Link to="/shop"><ArrowLeft className="mr-2 h-4 w-4" /> Volver</Link>
        </Button>

        <div className="grid gap-10 md:grid-cols-2">

          {/* Imágenes */}
          <div className="space-y-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
              <img
                src={mainImage || 'https://placehold.co/600x750?text=Sin+imagen'}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x750?text=Sin+imagen';
                }}
              />
              <div className="absolute left-3 top-3 flex gap-2">
                {product.badges?.includes('Nuevo') && (
                  <Badge className="bg-primary text-primary-foreground">Nuevo</Badge>
                )}
                {product.badges?.includes('Bestseller') && (
                  <Badge variant="secondary">Bestseller</Badge>
                )}
              </div>
            </div>

            {/* Miniaturas */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={cn(
                      "h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                      mainImage === img ? "border-primary" : "border-transparent"
                    )}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-sm uppercase tracking-wider text-muted-foreground">
              {product.category}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-3xl font-bold text-primary">
              ${product.price.toLocaleString('es-CO')} COP
            </p>
            {product.description && (
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {/* Tallas */}
            {sizes.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-semibold text-foreground">Talla</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colores */}
            {colors.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-foreground">Color</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors",
                        selectedColor === color
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-foreground hover:border-primary"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            {selectedVariant && (
              <p className={cn(
                "mt-4 text-sm font-medium",
                selectedVariant.stock > 5 ? "text-green-600" :
                selectedVariant.stock > 0 ? "text-amber-600" : "text-red-600"
              )}>
                {selectedVariant.stock > 5  ? `✅ ${selectedVariant.stock} disponibles` :
                 selectedVariant.stock > 0  ? `⚠️ Solo ${selectedVariant.stock} disponibles` :
                 "❌ Sin stock"}
              </p>
            )}

            {/* Botones */}
            <div className="mt-8 flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={cartLoading || selectedVariant?.stock === 0}
              >
                {cartLoading
                  ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  : <ShoppingBag className="mr-2 h-4 w-4" />
                }
                Agregar al carrito
              </Button>
              <Button size="lg" variant="outline" className="px-4">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
