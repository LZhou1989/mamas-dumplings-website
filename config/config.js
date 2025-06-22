require('dotenv').config();

const config = {
    // Server configuration
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // JWT configuration
    jwtSecret: process.env.JWT_SECRET || 'mamas-dumplings-super-secret-jwt-key-2024',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    
    // CORS configuration
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    
    // Database configuration (for future use)
    databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/mamas-dumplings',
    
    // Email configuration (for future use)
    emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
    emailPort: process.env.EMAIL_PORT || 587,
    emailUser: process.env.EMAIL_USER || '',
    emailPass: process.env.EMAIL_PASS || '',
    
    // Payment configuration (for future use)
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    
    // File upload configuration
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    maxFileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
};

module.exports = config; 