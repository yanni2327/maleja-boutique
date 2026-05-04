const Category = require('../models/Category');

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo categorías', error: error.message });
  }
};

// POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug  = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
    const image = req.file ? req.file.path : null;

    const category = await Category.create({ name, slug, description, image });
    res.status(201).json({ message: 'Categoría creada', category });
  } catch (error) {
    res.status(500).json({ message: 'Error creando categoría', error: error.message });
  }
};

module.exports = { getCategories, createCategory };
