const express = require('express');
const { authenticateToken, requireAuth } = require('../middleware/auth');
const { createOrder, getOrdersByUserId, getAllOrders } = require('../models/User');

const router = express.Router();

// Create a new order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, total } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Valid total is required' });
    }

    const orderData = {
      userId,
      items,
      total,
      status: 'pending'
    };

    const result = await createOrder(orderData);

    if (result.success) {
      res.status(201).json({ 
        message: 'Order created successfully', 
        order: result.order 
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = getOrdersByUserId(userId);
    
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all orders (admin only)
router.get('/all', authenticateToken, requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const orders = getAllOrders();
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const orders = isAdmin ? getAllOrders() : getOrdersByUserId(userId);
    const order = orders.find(o => o.id === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
