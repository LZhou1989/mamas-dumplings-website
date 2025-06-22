const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Sample reviews data (in a real app, this would come from a database)
let reviews = [
    {
        id: 1,
        productId: 1,
        userId: "user1",
        userName: "Maria S.",
        rating: 5,
        title: "Absolutely Delicious!",
        comment: "These pork and cabbage dumplings are amazing! The flavor is perfect and they're so fresh. Will definitely order again!",
        date: "2024-06-15T10:30:00Z",
        helpful: 12
    },
    {
        id: 2,
        productId: 1,
        userId: "user2",
        userName: "Hans M.",
        rating: 4,
        title: "Great Quality",
        comment: "Very good dumplings. The pork is tender and the cabbage adds nice texture. Only giving 4 stars because I wish there were more in the pack.",
        date: "2024-06-14T15:45:00Z",
        helpful: 8
    },
    {
        id: 3,
        productId: 2,
        userId: "user3",
        userName: "Lisa K.",
        rating: 5,
        title: "Perfect for Dinner",
        comment: "The chicken and mushroom combination is fantastic. These dumplings are now a regular part of our weekly meals.",
        date: "2024-06-13T18:20:00Z",
        helpful: 15
    },
    {
        id: 4,
        productId: 3,
        userId: "user4",
        userName: "Thomas B.",
        rating: 5,
        title: "Fresh and Flavorful",
        comment: "The shrimp and chive dumplings are incredibly fresh. You can taste the quality of the ingredients. Highly recommend!",
        date: "2024-06-12T12:15:00Z",
        helpful: 23
    },
    {
        id: 5,
        productId: 4,
        userId: "user5",
        userName: "Anna W.",
        rating: 4,
        title: "Spicy and Delicious",
        comment: "Love the heat in these beef dumplings! They have a nice kick without being overwhelming. Great for spice lovers.",
        date: "2024-06-11T20:30:00Z",
        helpful: 11
    },
    {
        id: 6,
        productId: 5,
        userId: "user6",
        userName: "Peter L.",
        rating: 5,
        title: "Perfect for Vegetarians",
        comment: "As a vegetarian, I'm always looking for good options. These tofu and vegetable dumplings are excellent!",
        date: "2024-06-10T14:25:00Z",
        helpful: 19
    },
    {
        id: 7,
        productId: 6,
        userId: "user7",
        userName: "Sarah J.",
        rating: 4,
        title: "Korean Fusion Done Right",
        comment: "The kimchi adds such a unique flavor to these dumplings. They're tangy, spicy, and absolutely delicious.",
        date: "2024-06-09T16:40:00Z",
        helpful: 14
    }
];

// Get reviews for a specific product
router.get('/product/:productId', (req, res) => {
    try {
        const { productId } = req.params;
        const productReviews = reviews.filter(review => review.productId === parseInt(productId));
        
        res.json({
            success: true,
            data: productReviews,
            count: productReviews.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
});

// Add a new review
router.post('/', (req, res) => {
    try {
        const { productId, userId, userName, rating, title, comment } = req.body;

        // Validate required fields
        if (!productId || !userId || !userName || !rating || !title || !comment) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const newReview = {
            id: uuidv4(),
            productId: parseInt(productId),
            userId,
            userName,
            rating: parseInt(rating),
            title,
            comment,
            date: new Date().toISOString(),
            helpful: 0
        };

        reviews.push(newReview);

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: newReview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding review',
            error: error.message
        });
    }
});

// Mark review as helpful
router.patch('/:reviewId/helpful', (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = reviews.find(r => r.id === reviewId);
        
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.helpful += 1;

        res.json({
            success: true,
            message: 'Review marked as helpful',
            data: {
                reviewId: review.id,
                helpful: review.helpful
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating review',
            error: error.message
        });
    }
});

// Get review statistics for a product
router.get('/product/:productId/stats', (req, res) => {
    try {
        const { productId } = req.params;
        const productReviews = reviews.filter(review => review.productId === parseInt(productId));
        
        if (productReviews.length === 0) {
            return res.json({
                success: true,
                data: {
                    totalReviews: 0,
                    averageRating: 0,
                    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                }
            });
        }

        const totalReviews = productReviews.length;
        const averageRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        productReviews.forEach(review => {
            ratingDistribution[review.rating]++;
        });

        res.json({
            success: true,
            data: {
                totalReviews,
                averageRating: Math.round(averageRating * 10) / 10,
                ratingDistribution
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching review statistics',
            error: error.message
        });
    }
});

module.exports = router; 