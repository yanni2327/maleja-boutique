import { useState }   from "react";
import { Link }        from "react-router-dom";
import { Button }      from "@/components/ui/button";
import { Separator }   from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Loader2 } from "lucide-react";
import { useCart }     from "@/context/CartContext";
import { createPayment } from "@/services/paymentService";
import { toast }       from "sonner";

const Cart = () => {
  const { items, totalPrice, loading, updateItem, emptyCart } = useCart();
  const [paying, setPaying] = useState(false);

  const shipping = totalPrice > 200000 ? 0 : totalPrice > 0 ? 15000 : 0;
  const total    = totalPrice + shipping;

  const handleProceedToPayment = async () => {
    const token = localStorage.getItem('maleja_token');
    if (!token) {
      toast.error("Debes iniciar sesión para pagar", {
        description: "Crea una cuenta o inicia sesión para continuar",
        action: { label: "Iniciar sesión", onClick: () => window.location.href = 'http://localhost:8090' }
      });
      return;
    }
    const user = JSON.parse(localStorage.getItem('maleja_user') || '{}');
    setPaying(true);
    try {
      const orderId = `order-${Date.now()}`;
      const payment = await createPayment({
        orderId,
        total,
        customerEmail: user.email || 'cliente@maleja.com',
        customerName:  user.name  || 'Cliente',
        customerPhone: user.phone || ''
      });
      window.location.href = payment.redirectUrl;
    } catch {
      toast.error("Error iniciando el pago. Intenta de nuevo.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="py-20 text-center text-muted-foreground">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      Cargando carrito...
    </div>
  );

  if (!items || items.length === 0) return (
    <div className="py-20 text-center">
      <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
      <h2 className="font-display text-xl font-semibold text-foreground">Tu carrito está vacío</h2>
      <p className="mt-2 text-muted-foreground">Agrega productos desde la tienda</p>
      <Button asChild className="mt-6"><Link to="/shop">Ver tienda</Link></Button>
    </div>
  );

  return (
    <div className="py-12">
      <div className="container max-w-4xl">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          <ShoppingBag className="mr-3 inline h-8 w-8 text-primary" />
          Tu Carrito
        </h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 rounded-lg border bg-card p-4">
                {item.image && (
                  <img src={item.image} alt={item.name}
                    className="h-28 w-20 rounded-md object-cover flex-shrink-0" />
                )}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Talla: {item.size} · Color: {item.color}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-7 w-7"
                        onClick={() => updateItem(item.productId, item.quantity - 1, item.size, item.color)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7"
                        onClick={() => updateItem(item.productId, item.quantity + 1, item.size, item.color)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-semibold text-primary">
                      ${(item.price * item.quantity).toLocaleString("es-CO")} COP
                    </p>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"
                      onClick={() => updateItem(item.productId, 0, item.size, item.color)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="text-destructive"
              onClick={() => { emptyCart(); toast.success("Carrito vaciado"); }}>
              <Trash2 className="mr-2 h-4 w-4" /> Vaciar carrito
            </Button>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Resumen</h2>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} productos)</span>
                <span>${totalPrice.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span className={shipping === 0 ? "text-green-600" : ""}>
                  {shipping === 0 ? "Gratis" : `$${shipping.toLocaleString("es-CO")}`}
                </span>
              </div>
              {shipping > 0 && <p className="text-xs text-muted-foreground">Envío gratis desde $200.000</p>}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toLocaleString("es-CO")} COP</span>
            </div>
            <Button className="mt-6 w-full" size="lg" onClick={handleProceedToPayment} disabled={paying}>
              {paying
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Iniciando pago...</>
                : <><CreditCard className="mr-2 h-4 w-4"/>Pagar con Wompi</>
              }
            </Button>
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">Métodos aceptados</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {['💳 Tarjeta','📱 Nequi','🏦 PSE','🏛️ Bancolombia'].map(m=>(
                  <span key={m} className="text-xs border rounded px-2 py-1 text-muted-foreground">{m}</span>
                ))}
              </div>
            </div>
            <Button variant="outline" className="mt-3 w-full" asChild>
              <Link to="/shop">Seguir comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
