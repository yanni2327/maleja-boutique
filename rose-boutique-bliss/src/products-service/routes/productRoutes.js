const express = require('express');
const router  = express.Router();
const { upload } = require('../config/cloudinary');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
} = require('../controllers/productController');

// Rutas públicas
router.get('/',    getProducts);
router.get('/:id', getProductById);

// Rutas admin (crear, editar, eliminar)
router.post('/',              upload.array('images', 5), createProduct);
router.put('/:id',            upload.array('images', 5), updateProduct);
router.delete('/:id',         deleteProduct);
router.delete('/:id/images',  deleteProductImage);

module.exports = router;
