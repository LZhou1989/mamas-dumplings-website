const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Conditional email service import to prevent startup errors
let emailService = null;
try {
    emailService = require('../config/emailService');
} catch (error) {
    console.warn('Email service not available:', error.message);
}

// Contact form submission
router.post('/', [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
    body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters long'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long'),
    body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, subject, message, phone } = req.body;

        const contactData = {
            name,
            email,
            subject,
            message,
            phone,
            submittedAt: new Date().toISOString()
        };

        // Send email notification to admin
        let emailResult = { success: false, error: 'Email service not available' };
        
        if (emailService) {
            emailResult = await emailService.sendContactNotification(contactData);
        } else {
            console.warn('Email service not available - skipping contact notification email');
        }

        if (emailResult.success) {
            res.status(200).json({
                success: true,
                message: 'Thank you for your message! We will get back to you soon.',
                data: {
                    messageId: emailResult.messageId,
                    submittedAt: contactData.submittedAt
                }
            });
        } else {
            // Log the error but don't fail the request
            console.error('Failed to send contact notification email:', emailResult.error);
            
            res.status(200).json({
                success: true,
                message: 'Thank you for your message! We will get back to you soon.',
                note: 'Your message was received but we encountered a technical issue. Please try again if you don\'t hear from us within 24 hours.'
            });
        }

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing contact form',
            error: error.message
        });
    }
});

// Get contact form statistics (for admin)
router.get('/stats', (req, res) => {
    try {
        // In a real app, you'd store contact submissions in a database
        // For now, we'll return a placeholder response
        res.json({
            success: true,
            data: {
                totalSubmissions: 0,
                recentSubmissions: [],
                averageResponseTime: '24 hours'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching contact statistics',
            error: error.message
        });
    }
});

module.exports = router; 