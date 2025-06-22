// const nodemailer = require('nodemailer');
require('dotenv').config();

// Temporary mock email service to prevent startup errors
const emailService = {
    // Send order confirmation email
    async sendOrderConfirmation(orderData, customerEmail) {
        console.log('Mock: Order confirmation email would be sent to:', customerEmail);
        return { success: true, messageId: 'mock-message-id' };
    },
    
    // Send contact form notification
    async sendContactNotification(contactData) {
        console.log('Mock: Contact notification email would be sent for:', contactData.name);
        return { success: true, messageId: 'mock-message-id' };
    },
    
    // Send password reset email
    async sendPasswordReset(email, resetToken) {
        console.log('Mock: Password reset email would be sent to:', email);
        return { success: true, messageId: 'mock-message-id' };
    }
};

module.exports = emailService; 