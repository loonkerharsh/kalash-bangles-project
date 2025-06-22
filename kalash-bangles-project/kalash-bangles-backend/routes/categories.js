
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const upload = require('../middleware/upload'); // For handling image uploads

// GET all categories
router.get('/', categoryController.getAllCategories);

// GET a single category by ID
router.get('/:categoryId', categoryController.getCategoryById);

// POST a new category (handles 'imageFile')
router.post('/', upload.single('imageFile'), categoryController.createCategory);

// PUT update a category (handles 'imageFile')
router.put('/:categoryId', upload.single('imageFile'), categoryController.updateCategory);

// DELETE a category
router.delete('/:categoryId', categoryController.deleteCategory);

module.exports = router;
