const nodemailer = require('nodemailer');
require('dotenv').config();

// Email configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail', // or 'sendgrid' if using SendGrid
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
});

// Email templates
const emailTemplates = {
    orderConfirmation: (orderData) => ({
        subject: `Order Confirmation - Mama's Dumplings #${orderData.orderNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #c34a36; color: white; padding: 20px; text-align: center;">
                    <h1>🥟 Mama's Dumplings</h1>
                </div>
                <div style="padding: 20px; background: #f9f9f9;">
                    <h2>Thank you for your order!</h2>
                    <p>Dear ${orderData.customerInfo.name},</p>
                    <p>Your order has been confirmed and is being prepared with love.</p>
                    
                    <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <h3>Order Details</h3>
                        <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
                        <p><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString()}</p>
                        <p><strong>Total Amount:</strong> €${orderData.totalAmount.toFixed(2)}</p>
                        <p><strong>Estimated Delivery:</strong> ${new Date(orderData.estimatedDelivery).toLocaleDateString()}</p>
                    </div>
                    
                    <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <h3>Order Items</h3>
                        ${orderData.items.map(item => `
                            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                                <span>${item.name} x${item.quantity}</span>
                                <span>€${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <h3>Delivery Address</h3>
                        <p>${orderData.customerInfo.address}</p>
                        <p>${orderData.customerInfo.city}, ${orderData.customerInfo.postalCode}</p>
                        <p>Phone: ${orderData.customerInfo.phone}</p>
                    </div>
                    
                    <p>We'll send you an update when your order is ready for delivery.</p>
                    <p>Thank you for choosing Mama's Dumplings!</p>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://mamas-dumplings.com" style="background: #c34a36; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
                    </div>
                </div>
            </div>
        `
    }),
    
    contactForm: (contactData) => ({
        subject: `New Contact Form Submission - ${contactData.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #c34a36; color: white; padding: 20px; text-align: center;">
                    <h1>🥟 Mama's Dumplings - Contact Form</h1>
                </div>
                <div style="padding: 20px; background: #f9f9f9;">
                    <h2>New Contact Form Submission</h2>
                    <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <p><strong>Name:</strong> ${contactData.name}</p>
                        <p><strong>Email:</strong> ${contactData.email}</p>
                        <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
                        <p><strong>Subject:</strong> ${contactData.subject}</p>
                        <p><strong>Message:</strong></p>
                        <p style="background: #f5f5f5; padding: 10px; border-radius: 3px;">${contactData.message}</p>
                    </div>
                </div>
            </div>
        `
    })
};

// Email service functions
const emailService = {
    // Send order confirmation email
    async sendOrderConfirmation(orderData, customerEmail) {
        try {
            const template = emailTemplates.orderConfirmation(orderData);
            const mailOptions = {
                from: process.env.EMAIL_USER || 'noreply@mamas-dumplings.com',
                to: customerEmail,
                subject: template.subject,
                html: template.html
            };
            
            const result = await transporter.sendMail(mailOptions);
            console.log('Order confirmation email sent:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Error sending order confirmation email:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Send contact form notification
    async sendContactNotification(contactData) {
        try {
            const template = emailTemplates.contactForm(contactData);
            const mailOptions = {
                from: process.env.EMAIL_USER || 'noreply@mamas-dumplings.com',
                to: process.env.ADMIN_EMAIL || 'admin@mamas-dumplings.com',
                subject: template.subject,
                html: template.html
            };
            
            const result = await transporter.sendMail(mailOptions);
            console.log('Contact notification email sent:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Error sending contact notification email:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Send password reset email
    async sendPasswordReset(email, resetToken) {
        try {
            const resetLink = `${process.env.FRONTEND_URL || 'https://mamas-dumplings.com'}/reset-password?token=${resetToken}`;
            const mailOptions = {
                from: process.env.EMAIL_USER || 'noreply@mamas-dumplings.com',
                to: email,
                subject: 'Password Reset - Mama\'s Dumplings',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: #c34a36; color: white; padding: 20px; text-align: center;">
                            <h1>🥟 Mama's Dumplings</h1>
                        </div>
                        <div style="padding: 20px; background: #f9f9f9;">
                            <h2>Password Reset Request</h2>
                            <p>You requested a password reset for your Mama's Dumplings account.</p>
                            <p>Click the button below to reset your password:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetLink}" style="background: #c34a36; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                            </div>
                            <p>If you didn't request this reset, please ignore this email.</p>
                            <p>This link will expire in 1 hour.</p>
                        </div>
                    </div>
                `
            };
            
            const result = await transporter.sendMail(mailOptions);
            console.log('Password reset email sent:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Error sending password reset email:', error);
            return { success: false, error: error.message };
        }
    }
};

module.exports = emailService; 