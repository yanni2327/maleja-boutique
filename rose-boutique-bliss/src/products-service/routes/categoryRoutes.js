const express  = require('express');
const router   = express.Router();
const { upload } = require('../config/cloudinary');
const { getCategories, createCategory } = require('../controllers/categoryController');

router.get('/',  getCategories);
router.post('/', upload.single('image'), createCategory);

module.exports = router;
