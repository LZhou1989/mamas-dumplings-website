const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Sample orders data (in a real app, this would come from a database)
let orders = [];

// Create a new order
router.post('/', async (req, res) => {
    try {
        const {
            customerInfo,
            items,
            totalAmount,
            shippingAddress
        } = req.body;

        // Validate required fields
        if (!customerInfo || !items || !totalAmount || !shippingAddress) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const newOrder = {
            id: uuidv4(),
            orderNumber: `MD-${Date.now()}`,
            customerInfo,
            items,
            totalAmount,
            shippingAddress,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        };

        orders.push(newOrder);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                orderId: newOrder.id,
                orderNumber: newOrder.orderNumber,
                totalAmount: newOrder.totalAmount,
                estimatedDelivery: newOrder.estimatedDelivery,
                status: newOrder.status
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
});

// Get all orders (for admin purposes)
router.get('/', (req, res) => {
    try {
        res.json({
            success: true,
            data: orders,
            count: orders.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
});

// Get order by ID
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const order = orders.find(o => o.id === id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
});

// Update order status
router.patch('/:id/status', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = orders.find(o => o.id === id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;
        order.updatedAt = new Date().toISOString();

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
});

module.exports = router; 