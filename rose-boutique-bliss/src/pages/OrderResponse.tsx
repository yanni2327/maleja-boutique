import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { getPaymentStatus } from '@/services/paymentService';

const OrderResponse = () => {
  const [searchParams]  = useSearchParams();
  const [status, setStatus]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);

  const referenceCode = searchParams.get('id') || searchParams.get('reference');

  useEffect(() => {
    if (!referenceCode) { setLoading(false); return; }

    // Consultar estado del pago
    const check = async () => {
      try {
        const data = await getPaymentStatus(referenceCode);
        setPayment(data);
        setStatus(data.status);
      } catch {
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    check();
    // Reintentar cada 5 segundos si está pendiente
    const interval = setInterval(async () => {
      try {
        const data = await getPaymentStatus(referenceCode);
        setPayment(data);
        setStatus(data.status);
        if (data.status !== 'pending') clearInterval(interval);
      } catch {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [referenceCode]);

  if (loading) return (
    <div className="container py-24 text-center">
      <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
      <p className="text-muted-foreground">Verificando tu pago...</p>
    </div>
  );

  const configs = {
    approved: {
      icon:    <CheckCircle className="h-20 w-20 text-green-500" />,
      title:   '¡Pago exitoso!',
      message: 'Tu pedido ha sido confirmado. Pronto recibirás tu ropa.',
      color:   'text-green-600'
    },
    rejected: {
      icon:    <XCircle className="h-20 w-20 text-red-500" />,
      title:   'Pago rechazado',
      message: 'Tu pago no pudo procesarse. Intenta con otro método de pago.',
      color:   'text-red-600'
    },
    pending: {
      icon:    <Clock className="h-20 w-20 text-amber-500" />,
      title:   'Pago pendiente',
      message: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
      color:   'text-amber-600'
    },
    error: {
      icon:    <XCircle className="h-20 w-20 text-red-500" />,
      title:   'Error en el pago',
      message: 'Ocurrió un error procesando tu pago. Contacta soporte.',
      color:   'text-red-600'
    }
  };

  const config = configs[status as keyof typeof configs] || configs.error;

  return (
    <div className="container py-24 max-w-lg mx-auto text-center">
      <div className="rounded-xl border bg-card p-10 shadow-sm">
        <div className="flex justify-center mb-6">{config.icon}</div>
        <h1 className={`font-display text-3xl font-bold mb-3 ${config.color}`}>
          {config.title}
        </h1>
        <p className="text-muted-foreground mb-6">{config.message}</p>

        {payment && (
          <div className="rounded-lg bg-muted p-4 text-left text-sm mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Referencia:</span>
              <span className="font-mono font-medium">{payment.referenceCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total pagado:</span>
              <span className="font-semibold text-primary">
                ${payment.amountCOP?.toLocaleString('es-CO')} COP
              </span>
            </div>
            {payment.method && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Método:</span>
                <span>{payment.method}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button asChild><Link to="/shop">Seguir comprando</Link></Button>
          <Button variant="outline" asChild><Link to="/">Inicio</Link></Button>
        </div>
      </div>
    </div>
  );
};

export default OrderResponse;
