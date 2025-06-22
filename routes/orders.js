const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Conditional email service import to prevent startup errors
let emailService = null;
try {
    emailService = require('../config/emailService');
} catch (error) {
    console.warn('Email service not available:', error.message);
}

const paymentService = require('../config/paymentService');

// Sample orders data (in a real app, this would come from a database)
let orders = [];

// Create a new order with payment and email integration
router.post('/', async (req, res) => {
    try {
        const {
            customerInfo,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentIntentId
        } = req.body;

        // Validate required fields
        if (!customerInfo || !items || !totalAmount || !shippingAddress) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Verify payment if paymentIntentId is provided
        if (paymentIntentId) {
            const paymentResult = await paymentService.confirmPayment(paymentIntentId);
            if (!paymentResult.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment verification failed',
                    error: paymentResult.error
                });
            }
        }

        const newOrder = {
            id: uuidv4(),
            orderNumber: `MD-${Date.now()}`,
            customerInfo,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'Credit Card',
            paymentIntentId: paymentIntentId || null,
            status: paymentIntentId ? 'confirmed' : 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        };

        orders.push(newOrder);

        // Send order confirmation email
        if (customerInfo.email && emailService) {
            try {
                await emailService.sendOrderConfirmation(newOrder, customerInfo.email);
            } catch (emailError) {
                console.error('Failed to send order confirmation email:', emailError);
                // Don't fail the order creation if email fails
            }
        } else if (customerInfo.email && !emailService) {
            console.warn('Email service not available - skipping order confirmation email');
        }

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

// Create payment intent for order
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { orderData } = req.body;

        if (!orderData || !orderData.totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Order data and total amount are required'
            });
        }

        const paymentResult = await paymentService.createPaymentIntent(orderData);

        if (paymentResult.success) {
            res.json({
                success: true,
                clientSecret: paymentResult.clientSecret,
                paymentIntentId: paymentResult.paymentIntentId
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to create payment intent',
                error: paymentResult.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating payment intent',
            error: error.message
        });
    }
});

// Process refund for order
router.post('/:id/refund', async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, reason } = req.body;

        const order = orders.find(o => o.id === id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (!order.paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: 'Order has no payment intent to refund'
            });
        }

        const refundResult = await paymentService.createRefund(order.paymentIntentId, amount);

        if (refundResult.success) {
            // Update order status
            order.status = 'refunded';
            order.refundAmount = refundResult.amount;
            order.refundReason = reason;
            order.updatedAt = new Date().toISOString();

            res.json({
                success: true,
                message: 'Refund processed successfully',
                data: {
                    orderId: order.id,
                    orderNumber: order.orderNumber,
                    refundAmount: refundResult.amount,
                    refundId: refundResult.refundId
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to process refund',
                error: refundResult.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing refund',
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