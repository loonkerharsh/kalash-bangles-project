
const express = require('express');
const router = express.Router();

const categoryRoutes = require('./categories');
const bangleRoutes = require('./bangles');
const orderRoutes = require('./orders');

router.use('/categories', categoryRoutes);
router.use('/bangles', bangleRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
