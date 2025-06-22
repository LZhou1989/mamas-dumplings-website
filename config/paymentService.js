const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const paymentService = {
    // Create a payment intent for the order
    async createPaymentIntent(orderData) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(orderData.totalAmount * 100), // Convert to cents
                currency: 'eur',
                metadata: {
                    orderNumber: orderData.orderNumber,
                    customerEmail: orderData.customerInfo.email,
                    customerName: orderData.customerInfo.name
                },
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            return {
                success: true,
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            };
        } catch (error) {
            console.error('Error creating payment intent:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Confirm payment intent
    async confirmPayment(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            
            if (paymentIntent.status === 'succeeded') {
                return {
                    success: true,
                    paymentStatus: 'succeeded',
                    amount: paymentIntent.amount / 100, // Convert back to euros
                    currency: paymentIntent.currency
                };
            } else {
                return {
                    success: false,
                    paymentStatus: paymentIntent.status,
                    error: 'Payment not completed'
                };
            }
        } catch (error) {
            console.error('Error confirming payment:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Create a refund
    async createRefund(paymentIntentId, amount = null) {
        try {
            const refundData = {
                payment_intent: paymentIntentId
            };

            if (amount) {
                refundData.amount = Math.round(amount * 100); // Convert to cents
            }

            const refund = await stripe.refunds.create(refundData);

            return {
                success: true,
                refundId: refund.id,
                amount: refund.amount / 100,
                status: refund.status
            };
        } catch (error) {
            console.error('Error creating refund:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Get payment methods for a customer
    async getPaymentMethods(customerId) {
        try {
            const paymentMethods = await stripe.paymentMethods.list({
                customer: customerId,
                type: 'card',
            });

            return {
                success: true,
                paymentMethods: paymentMethods.data
            };
        } catch (error) {
            console.error('Error getting payment methods:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Create or update customer
    async createCustomer(customerData) {
        try {
            const customer = await stripe.customers.create({
                email: customerData.email,
                name: customerData.name,
                phone: customerData.phone,
                metadata: {
                    address: customerData.address,
                    city: customerData.city,
                    postalCode: customerData.postalCode
                }
            });

            return {
                success: true,
                customerId: customer.id
            };
        } catch (error) {
            console.error('Error creating customer:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Update customer
    async updateCustomer(customerId, customerData) {
        try {
            const customer = await stripe.customers.update(customerId, {
                email: customerData.email,
                name: customerData.name,
                phone: customerData.phone,
                metadata: {
                    address: customerData.address,
                    city: customerData.city,
                    postalCode: customerData.postalCode
                }
            });

            return {
                success: true,
                customer: customer
            };
        } catch (error) {
            console.error('Error updating customer:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Get customer details
    async getCustomer(customerId) {
        try {
            const customer = await stripe.customers.retrieve(customerId);
            return {
                success: true,
                customer: customer
            };
        } catch (error) {
            console.error('Error getting customer:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Create a webhook event (for testing)
    async createWebhookEvent(eventType, data) {
        try {
            const event = {
                id: `evt_${Date.now()}`,
                object: 'event',
                api_version: '2023-10-16',
                created: Math.floor(Date.now() / 1000),
                data: data,
                livemode: false,
                pending_webhooks: 1,
                request: {
                    id: `req_${Date.now()}`,
                    idempotency_key: null
                },
                type: eventType
            };

            return {
                success: true,
                event: event
            };
        } catch (error) {
            console.error('Error creating webhook event:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};

module.exports = paymentService; 