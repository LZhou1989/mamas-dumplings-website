# 📧 Email & Payment Services Setup Guide

This guide will help you set up email notifications and payment processing for your Mama's Dumplings website.

## 🔧 Environment Variables Setup

Create a `.env` file in your project root with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@mamas-dumplings.com
FRONTEND_URL=https://mamas-dumplings.com

# Stripe Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# JWT Secret for Authentication
JWT_SECRET=your-super-secret-jwt-key-here
```

## 📧 Email Service Setup

### Option 1: Gmail (Free, Good for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Update your `.env` file**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

### Option 2: SendGrid (Recommended for Business)

1. **Sign up** at [sendgrid.com](https://sendgrid.com)
2. **Verify your domain** for better deliverability
3. **Get API key** from SendGrid dashboard
4. **Update emailService.js** to use SendGrid instead of Gmail

## 💳 Payment Service Setup (Stripe)

### 1. Create Stripe Account

1. **Sign up** at [stripe.com](https://stripe.com)
2. **Complete account verification**
3. **Get your API keys** from the Stripe Dashboard

### 2. Get API Keys

1. Go to **Developers → API keys** in Stripe Dashboard
2. Copy your **Publishable key** and **Secret key**
3. **Update your `.env` file**:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   ```

### 3. Test Mode vs Live Mode

- **Test Mode**: Use `sk_test_` and `pk_test_` keys for development
- **Live Mode**: Use `sk_live_` and `pk_live_` keys for production

## 🚀 Frontend Integration

### 1. Add Stripe to Frontend

Add this script to your HTML files (before closing `</body>` tag):

```html
<script src="https://js.stripe.com/v3/"></script>
```

### 2. Update Checkout Process

Update your `js/checkout.js` to integrate with Stripe:

```javascript
// Initialize Stripe
const stripe = Stripe('pk_test_your_publishable_key_here');

// Create payment intent
async function createPaymentIntent(orderData) {
    const response = await fetch('/api/orders/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderData })
    });
    
    const result = await response.json();
    return result;
}

// Process payment
async function processPayment(clientSecret, paymentMethod) {
    const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod
    });
    
    return result;
}
```

## 📱 Contact Form Integration

Update your contact form in `contact.html` to use the new API:

```javascript
// In contact.js
async function submitContactForm(formData) {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    return result;
}
```

## 🔒 Security Best Practices

### 1. Environment Variables
- **Never commit** your `.env` file to Git
- Use different keys for development and production
- Rotate keys regularly

### 2. Email Security
- Use app passwords, not your main password
- Enable 2FA on email accounts
- Monitor for suspicious activity

### 3. Payment Security
- Always use HTTPS in production
- Validate all payment data server-side
- Implement webhook verification
- Use Stripe's built-in security features

## 🧪 Testing

### Test Email Service
```bash
# Test email sending
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","subject":"Test","message":"Test message"}'
```

### Test Payment Service
```bash
# Test payment intent creation
curl -X POST http://localhost:3000/api/orders/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"orderData":{"totalAmount":25.99}}'
```

## 🚀 Deployment

### 1. Set Environment Variables
When deploying to Render/Heroku, set these environment variables in your deployment platform's dashboard.

### 2. Update Frontend URLs
Make sure `FRONTEND_URL` points to your live domain.

### 3. Test Everything
- Test email sending
- Test payment processing
- Test contact form
- Verify order confirmations

## 🆘 Troubleshooting

### Email Issues
- Check app password is correct
- Verify 2FA is enabled
- Check email service logs

### Payment Issues
- Verify Stripe keys are correct
- Check Stripe dashboard for errors
- Test with Stripe's test cards

### Common Errors
- `Invalid API key`: Check your Stripe keys
- `Authentication failed`: Check email credentials
- `CORS error`: Verify frontend URL settings

## 📞 Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify all environment variables are set
3. Test locally first
4. Check Stripe/SendGrid documentation

---

**🎉 Congratulations! Your Mama's Dumplings website now has professional email and payment services!** 