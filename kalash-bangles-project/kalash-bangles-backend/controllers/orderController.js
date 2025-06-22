
const pool = require('../db');

const getOrderWithItems = async (orderId, connection = pool) => {
  const [orderRows] = await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  if (orderRows.length === 0) return null;

  const order = orderRows[0];
  if (order.customerDetails && typeof order.customerDetails === 'string') {
    order.customerDetails = JSON.parse(order.customerDetails);
  }

  const [itemRows] = await connection.query('SELECT * FROM order_items WHERE orderId = ?', [orderId]);
  order.items = itemRows;
  return order;
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY createdAt DESC');
    const detailedOrders = await Promise.all(
      orders.map(order => getOrderWithItems(order.id))
    );
    res.json(detailedOrders.filter(o => o !== null));
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (isNaN(parseInt(orderId))) {
        return res.status(400).json({ error: 'Invalid Order ID format.' });
    }
    const order = await getOrderWithItems(parseInt(orderId));
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { items, customerDetails } = req.body;

    if (!items || items.length === 0 || !customerDetails) {
      return res.status(400).json({ error: 'Missing items or customer details' });
    }

    // Calculate totalAmount based on items received
    // This assumes items have priceAtPurchase and quantity
    let totalAmount = 0;
    for (const item of items) {
        if (typeof item.priceAtPurchase !== 'number' || typeof item.quantity !== 'number' || item.priceAtPurchase < 0 || item.quantity <= 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Invalid item price or quantity.' });
        }
        totalAmount += item.priceAtPurchase * item.quantity;
    }
    
    totalAmount = parseFloat(totalAmount.toFixed(2));


    const [result] = await connection.query(
      'INSERT INTO orders (customerDetails, totalAmount, status) VALUES (?, ?, ?)',
      [JSON.stringify(customerDetails), totalAmount, 'Pending']
    );
    const orderId = result.insertId;

    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (orderId, bangleId, bangleName, colorVariantId, colorName, selectedSize, quantity, priceAtPurchase) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [orderId, item.bangleId, item.bangleName, item.colorVariantId, item.colorName, item.selectedSize, item.quantity, item.priceAtPurchase]
      );
    }

    await connection.commit();
    const newOrder = await getOrderWithItems(orderId, connection);
    res.status(201).json(newOrder);
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
     if (isNaN(parseInt(orderId))) {
        return res.status(400).json({ error: 'Invalid Order ID format.' });
    }

    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, parseInt(orderId)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found or status unchanged' });
    }
    
    const updatedOrder = await getOrderWithItems(parseInt(orderId));
    res.json(updatedOrder);
  } catch (err) {
    next(err);
  }
};
