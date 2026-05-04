const Product    = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// ── GET /api/products ─────────────────────────────
// Listar productos (con filtros opcionales por categoría, badge, búsqueda)
const getProducts = async (req, res) => {
  try {
    const { category, badge, search, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (badge)    filter.badges   = badge;
    if (search)   filter.$text    = { $search: search };

    const skip     = (page - 1) * limit;
    const products = await Product.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const total    = await Product.countDocuments(filter);

    res.json({ products, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo productos', error: error.message });
  }
};

// ── GET /api/products/:id ─────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo producto', error: error.message });
  }
};

// ── POST /api/products ────────────────────────────
// Crear producto con imágenes subidas a Cloudinary
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, badges, variants } = req.body;

    // Las imágenes ya fueron subidas a Cloudinary por el middleware upload
    const images = req.files ? req.files.map(f => f.path) : [];

    const product = await Product.create({
      name,
      description,
      price:    Number(price),
      category,
      images,
      badges:   badges   ? JSON.parse(badges)   : [],
      variants: variants ? JSON.parse(variants) : [],
    });

    res.status(201).json({ message: 'Producto creado', product });
  } catch (error) {
    res.status(500).json({ message: 'Error creando producto', error: error.message });
  }
};

// ── PUT /api/products/:id ─────────────────────────
const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Si subieron nuevas imágenes, agregar las URLs de Cloudinary
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => f.path);
      const product   = await Product.findById(req.params.id);
      updates.images  = [...(product.images || []), ...newImages];
    }

    if (updates.badges)   updates.badges   = JSON.parse(updates.badges);
    if (updates.variants) updates.variants = JSON.parse(updates.variants);
    if (updates.price)    updates.price    = Number(updates.price);

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    res.json({ message: 'Producto actualizado', product });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando producto', error: error.message });
  }
};

// ── DELETE /api/products/:id ──────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
 
    // Intentar eliminar imágenes de Cloudinary (no falla si hay error)
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          // Extraer el public_id de la URL de Cloudinary
          const parts   = imageUrl.split('/');
          const folder  = parts[parts.length - 2];
          const file    = parts[parts.length - 1].replace(/\.[^/.]+$/, '');
          const publicId = `${folder}/${file}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudErr) {
          console.warn('No se pudo eliminar imagen de Cloudinary:', cloudErr.message);
        }
      }
    }
 
    await product.deleteOne();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando producto', error: error.message });
  }
};
 

// ── DELETE /api/products/:id/images ──────────────
// Eliminar una imagen específica de un producto
const deleteProductImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const publicId = imageUrl.split('/').slice(-2).join('/').replace(/\.[^/.]+$/, '');
    await cloudinary.uploader.destroy(publicId);

    product.images = product.images.filter(img => img !== imageUrl);
    await product.save();

    res.json({ message: 'Imagen eliminada', product });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando imagen', error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, deleteProductImage };
