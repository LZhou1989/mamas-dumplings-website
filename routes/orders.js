const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Sample orders data (in a real app, this would come from a database)
let orders = [];

// Create a new order
router.post('/', (req, res) => {
    try {
        const {
            customerInfo,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
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
            paymentMethod: paymentMethod || 'Credit Card',
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
                estimatedDelivery: newOrder.estimatedDelivery
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

// Get orders by customer email
router.get('/customer/:email', (req, res) => {
    try {
        const { email } = req.params;
        const customerOrders = orders.filter(order => 
            order.customerInfo.email === email
        );
        
        res.json({
            success: true,
            data: customerOrders,
            count: customerOrders.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching customer orders',
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
        
        const validStatuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
            });
        }
        
        order.status = status;
        order.updatedAt = new Date().toISOString();
        
        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: {
                orderId: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                updatedAt: order.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
});

// Cancel order
router.patch('/:id/cancel', (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        
        const order = orders.find(o => o.id === id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        if (order.status === 'delivered' || order.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled'
            });
        }
        
        order.status = 'cancelled';
        order.cancellationReason = reason;
        order.updatedAt = new Date().toISOString();
        
        res.json({
            success: true,
            message: 'Order cancelled successfully',
            data: {
                orderId: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                cancellationReason: order.cancellationReason
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error cancelling order',
            error: error.message
        });
    }
});

// Get order statistics
router.get('/stats/overview', (req, res) => {
    try {
        const stats = {
            totalOrders: orders.length,
            pendingOrders: orders.filter(o => o.status === 'pending').length,
            confirmedOrders: orders.filter(o => o.status === 'confirmed').length,
            preparingOrders: orders.filter(o => o.status === 'preparing').length,
            shippedOrders: orders.filter(o => o.status === 'shipped').length,
            deliveredOrders: orders.filter(o => o.status === 'delivered').length,
            cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
            totalRevenue: orders
                .filter(o => o.status !== 'cancelled')
                .reduce((sum, order) => sum + order.totalAmount, 0)
        };
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order statistics',
            error: error.message
        });
    }
});

module.exports = router; 