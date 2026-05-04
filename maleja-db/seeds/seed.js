require('dotenv').config();
const mongoose  = require('mongoose');
const connectDB = require('../config/db');

const Category = require('../models/Category');
const Product  = require('../models/Product');

const categories = [
  { name: 'Vestidos',   slug: 'vestidos',   isActive: true },
  { name: 'Blusas',     slug: 'blusas',     isActive: true },
  { name: 'Faldas',     slug: 'faldas',     isActive: true },
  { name: 'Pantalones', slug: 'pantalones', isActive: true },
  { name: 'Chaquetas',  slug: 'chaquetas',  isActive: true },
  { name: 'Tops',       slug: 'tops',       isActive: true },
];

const products = [
  {
    name:        'Vestido Floral Primavera',
    description: 'Vestido midi con estampado floral, perfecto para ocasiones especiales.',
    price:       189000,
    category:    'Vestidos',
    badges:      ['Nuevo'],
    variants: [
      { size: 'S',  color: 'Rosa',   stock: 10, sku: 'VFP-S-ROSA' },
      { size: 'M',  color: 'Rosa',   stock: 15, sku: 'VFP-M-ROSA' },
      { size: 'L',  color: 'Rosa',   stock:  8, sku: 'VFP-L-ROSA' },
    ],
    isActive: true
  },
  {
    name:        'Blusa Elegante Off Shoulder',
    description: 'Blusa de hombros descubiertos con tela suave y fluida.',
    price:       89000,
    category:    'Blusas',
    badges:      ['Bestseller'],
    variants: [
      { size: 'XS', color: 'Blanco', stock:  5, sku: 'BEO-XS-BLANCO' },
      { size: 'S',  color: 'Blanco', stock: 12, sku: 'BEO-S-BLANCO'  },
      { size: 'M',  color: 'Blanco', stock: 20, sku: 'BEO-M-BLANCO'  },
    ],
    isActive: true
  },
  {
    name:        'Falda Midi Plisada',
    description: 'Falda midi plisada con cintura elástica, muy versátil.',
    price:       125000,
    category:    'Faldas',
    badges:      [],
    variants: [
      { size: 'S', color: 'Beige', stock: 8,  sku: 'FMP-S-BEIGE' },
      { size: 'M', color: 'Beige', stock: 10, sku: 'FMP-M-BEIGE' },
      { size: 'L', color: 'Negro', stock: 6,  sku: 'FMP-L-NEGRO'  },
    ],
    isActive: true
  },
  {
    name:        'Pantalón Wide Leg',
    description: 'Pantalón de pierna ancha con corte moderno y tela de alta calidad.',
    price:       145000,
    category:    'Pantalones',
    badges:      ['Nuevo'],
    variants: [
      { size: 'S', color: 'Negro', stock: 10, sku: 'PWL-S-NEGRO' },
      { size: 'M', color: 'Negro', stock: 15, sku: 'PWL-M-NEGRO' },
      { size: 'L', color: 'Caqui', stock:  7, sku: 'PWL-L-CAQUI'  },
    ],
    isActive: true
  },
];

const seed = async () => {
  await connectDB();
  try {
    await Category.deleteMany({});
    await Product.deleteMany({});

    await Category.insertMany(categories);
    await Product.insertMany(products);

    console.log(`✅ Seed completado: ${categories.length} categorías, ${products.length} productos`);
  } catch (err) {
    console.error('❌ Error en seed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
