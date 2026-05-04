import { useState, useEffect, useRef } from "react";
import { Button }    from "@/components/ui/button";
import { Input }     from "@/components/ui/input";
import { Label }     from "@/components/ui/label";
import { Textarea }  from "@/components/ui/textarea";
import { Badge }     from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle }  from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Package, Pencil, Trash2, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getProducts, Product } from "@/services/productService";
import { productsApi } from "@/services/api";

const Admin = () => {
  const [products, setProducts]     = useState<Product[]>([]);
  const [loading,  setLoading]      = useState(true);
  const [uploading, setUploading]   = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving]         = useState(false);

  // Form nuevo producto
  const [form, setForm] = useState({
    name: "", description: "", price: "", category: "", badges: ""
  });
  const [formImages, setFormImages] = useState<FileList | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ limit: 50 });
      setProducts(res.products);
    } catch {
      toast.error("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  // ── Subir imagen a un producto existente ─────────
  const handleUploadImage = async (productId: string) => {
    const file = fileRefs.current[productId]?.files?.[0];
    if (!file) { toast.error("Selecciona una imagen primero"); return; }

    setUploading(productId);
    try {
      const formData = new FormData();
      formData.append("images", file);
      await productsApi.put(`/products/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("✅ Imagen subida a Cloudinary");
      await loadProducts();
    } catch {
      toast.error("Error subiendo imagen");
    } finally {
      setUploading(null);
    }
  };

  // ── Crear producto nuevo ──────────────────────────
  const handleCreateProduct = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error("Nombre, precio y categoría son requeridos");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name",        form.name);
      formData.append("description", form.description);
      formData.append("price",       form.price);
      formData.append("category",    form.category);
      formData.append("badges",      JSON.stringify(
        form.badges ? form.badges.split(",").map(b => b.trim()) : []
      ));
      formData.append("variants", JSON.stringify([
        { size: "S", color: "Único", stock: 10, sku: `${form.name.slice(0,3).toUpperCase()}-S-001` },
        { size: "M", color: "Único", stock: 10, sku: `${form.name.slice(0,3).toUpperCase()}-M-001` },
        { size: "L", color: "Único", stock: 10, sku: `${form.name.slice(0,3).toUpperCase()}-L-001` },
      ]));
      if (formImages?.[0]) formData.append("images", formImages[0]);

      await productsApi.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("✅ Producto creado correctamente");
      setDialogOpen(false);
      setForm({ name: "", description: "", price: "", category: "", badges: "" });
      setFormImages(null);
      await loadProducts();
    } catch {
      toast.error("Error creando producto");
    } finally {
      setSaving(false);
    }
  };

  // ── Eliminar producto ─────────────────────────────
  const handleDelete = async (productId: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    try {
      await productsApi.delete(`/products/${productId}`);
      toast.success("Producto eliminado");
      await loadProducts();
    } catch {
      toast.error("Error eliminando producto");
    }
  };

  return (
    <div className="py-8">
      <div className="container">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona tu catálogo y ventas</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Nuevo Producto</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display">Agregar Producto</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Nombre</Label>
                  <Input className="mt-1" placeholder="Ej: Vestido Satinado Rosa"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Precio (COP)</Label>
                    <Input className="mt-1" type="number" placeholder="189000"
                      value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                  </div>
                  <div>
                    <Label>Categoría</Label>
                    <Input className="mt-1" placeholder="Vestidos"
                      value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                  </div>
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea className="mt-1" placeholder="Descripción del producto..."
                    value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div>
                  <Label>Badges (separados por coma)</Label>
                  <Input className="mt-1" placeholder="Nuevo, Bestseller"
                    value={form.badges} onChange={e => setForm({...form, badges: e.target.value})} />
                </div>
                <div>
                  <Label>Imagen principal</Label>
                  <Input className="mt-1" type="file" accept="image/*"
                    onChange={e => setFormImages(e.target.files)} />
                </div>
                <Button onClick={handleCreateProduct} disabled={saving}>
                  {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Guardando...</> : "Guardar Producto"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-secondary p-3">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productos</p>
                <p className="text-2xl font-bold text-foreground">{products.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="mt-10">
          <TabsList>
            <TabsTrigger value="products">Productos</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Catálogo de Productos</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-10 text-muted-foreground">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cargando...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div key={product._id} className="flex items-center gap-4 rounded-lg border p-3">

                        {/* Imagen */}
                        <div className="relative h-16 w-16 flex-shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name}
                              className="h-16 w-16 rounded-md object-cover" />
                          ) : (
                            <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                              <ImagePlus className="h-6 w-6 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{product.name}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-muted-foreground">{product.category}</span>
                            {product.badges?.map(b => (
                              <Badge key={b} variant="secondary" className="text-xs">{b}</Badge>
                            ))}
                          </div>

                          {/* Upload imagen */}
                          <div className="mt-2 flex items-center gap-2">
                            <input type="file" accept="image/*" className="text-xs w-36"
                              ref={el => { fileRefs.current[product._id] = el; }} />
                            <Button size="sm" variant="outline" className="h-7 text-xs"
                              disabled={uploading === product._id}
                              onClick={() => handleUploadImage(product._id)}>
                              {uploading === product._id
                                ? <Loader2 className="h-3 w-3 animate-spin" />
                                : "☁️ Subir"}
                            </Button>
                          </div>
                        </div>

                        {/* Precio y acciones */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <p className="font-semibold text-primary">
                            ${product.price.toLocaleString("es-CO")}
                          </p>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(product._id, product.name)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default Admin;
