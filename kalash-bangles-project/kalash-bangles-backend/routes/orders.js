
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET all orders
router.get('/', orderController.getAllOrders);

// POST a new order (for customer-facing app)
router.post('/', orderController.createOrder);

// GET a single order by ID
router.get('/:orderId', orderController.getOrderById);

// PUT update order status
router.put('/:orderId/status', orderController.updateOrderStatus);

module.exports = router;
