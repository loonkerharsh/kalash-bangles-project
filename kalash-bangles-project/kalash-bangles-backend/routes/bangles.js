
const express = require('express');
const router = express.Router();
const bangleController = require('../controllers/bangleController');
const upload = require('../middleware/upload'); // Using upload.any()

// GET all bangles or by categoryId
router.get('/', bangleController.getAllBangles);

// GET a single bangle by ID
router.get('/:bangleId', bangleController.getBangleById);

// POST a new bangle (handles baseImageFile and variant image files)
router.post('/', upload.any(), bangleController.createBangle);

// PUT update a bangle (handles baseImageFile and variant image files)
router.put('/:bangleId', upload.any(), bangleController.updateBangle);

// DELETE a bangle
router.delete('/:bangleId', bangleController.deleteBangle);

module.exports = router;
