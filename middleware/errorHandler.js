const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Default error
    let error = {
        message: err.message || 'Something went wrong!',
        statusCode: err.statusCode || 500
    };

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = {
            message,
            statusCode: 400
        };
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = {
            message: `${field} already exists`,
            statusCode: 400
        };
    }

    // Mongoose cast error
    if (err.name === 'CastError') {
        error = {
            message: 'Resource not found',
            statusCode: 404
        };
    }

    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler; 