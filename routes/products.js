const express = require('express');
const router = express.Router();

// Sample product data (in a real app, this would come from a database)
const products = [
    {
        id: 1,
        name: "Pork & Cabbage Dumplings",
        category: "Dumplings",
        subcategory: "Pork",
        price: 12.99,
        image: "images/pork-cabbage-dumplings.jpg",
        description: "Traditional pork and cabbage dumplings with our secret family recipe",
        ingredients: ["Pork", "Cabbage", "Ginger", "Soy Sauce", "Wonton Wrapper"],
        allergens: ["Soy", "Wheat"],
        nutrition: {
            calories: 280,
            protein: "12g",
            carbs: "45g",
            fat: "8g"
        },
        inStock: true,
        rating: 4.8,
        reviews: 156
    },
    {
        id: 2,
        name: "Chicken & Mushroom Dumplings",
        category: "Dumplings",
        subcategory: "Chicken",
        price: 13.99,
        image: "images/chicken-mushroom-dumplings.jpg",
        description: "Savory chicken and mushroom dumplings with aromatic herbs",
        ingredients: ["Chicken", "Mushrooms", "Green Onions", "Ginger", "Wonton Wrapper"],
        allergens: ["Soy", "Wheat"],
        nutrition: {
            calories: 265,
            protein: "14g",
            carbs: "42g",
            fat: "7g"
        },
        inStock: true,
        rating: 4.7,
        reviews: 89
    },
    {
        id: 3,
        name: "Shrimp & Chive Dumplings",
        category: "Dumplings",
        subcategory: "Seafood",
        price: 15.99,
        image: "images/shrimp-chive-dumplings.jpg",
        description: "Fresh shrimp and chive dumplings with a delicate flavor",
        ingredients: ["Shrimp", "Chives", "Ginger", "Sesame Oil", "Wonton Wrapper"],
        allergens: ["Shellfish", "Soy", "Wheat"],
        nutrition: {
            calories: 245,
            protein: "16g",
            carbs: "38g",
            fat: "6g"
        },
        inStock: true,
        rating: 4.9,
        reviews: 203
    },
    {
        id: 4,
        name: "Spicy Beef Dumplings",
        category: "Dumplings",
        subcategory: "Beef",
        price: 14.99,
        image: "images/spicy-beef-dumplings.jpg",
        description: "Spicy beef dumplings with a kick of heat and bold flavors",
        ingredients: ["Beef", "Chili", "Garlic", "Soy Sauce", "Wonton Wrapper"],
        allergens: ["Soy", "Wheat"],
        nutrition: {
            calories: 295,
            protein: "18g",
            carbs: "40g",
            fat: "10g"
        },
        inStock: true,
        rating: 4.6,
        reviews: 67
    },
    {
        id: 5,
        name: "Vegetable & Tofu Dumplings",
        category: "Dumplings",
        subcategory: "Vegetarian",
        price: 11.99,
        image: "images/vegetable-tofu-dumplings.jpg",
        description: "Healthy vegetable and tofu dumplings for vegetarian diners",
        ingredients: ["Tofu", "Carrots", "Cabbage", "Mushrooms", "Wonton Wrapper"],
        allergens: ["Soy", "Wheat"],
        nutrition: {
            calories: 220,
            protein: "10g",
            carbs: "35g",
            fat: "5g"
        },
        inStock: true,
        rating: 4.5,
        reviews: 134
    },
    {
        id: 6,
        name: "Kimchi & Pork Dumplings",
        category: "Dumplings",
        subcategory: "Pork",
        price: 13.99,
        image: "images/kimchi-pork-dumplings.jpg",
        description: "Korean-inspired kimchi and pork dumplings with tangy flavor",
        ingredients: ["Pork", "Kimchi", "Garlic", "Sesame Oil", "Wonton Wrapper"],
        allergens: ["Soy", "Wheat"],
        nutrition: {
            calories: 275,
            protein: "13g",
            carbs: "43g",
            fat: "8g"
        },
        inStock: true,
        rating: 4.7,
        reviews: 98
    }
];

// Get all products
router.get('/', (req, res) => {
    try {
        res.json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
});

// Get products by category
router.get('/category/:category', (req, res) => {
    try {
        const { category } = req.params;
        const filteredProducts = products.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
        
        res.json({
            success: true,
            data: filteredProducts,
            count: filteredProducts.length,
            category: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products by category',
            error: error.message
        });
    }
});

// Get products by subcategory
router.get('/subcategory/:subcategory', (req, res) => {
    try {
        const { subcategory } = req.params;
        const filteredProducts = products.filter(product => 
            product.subcategory.toLowerCase() === subcategory.toLowerCase()
        );
        
        res.json({
            success: true,
            data: filteredProducts,
            count: filteredProducts.length,
            subcategory: subcategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products by subcategory',
            error: error.message
        });
    }
});

// Get single product by ID
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const product = products.find(p => p.id === parseInt(id));
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
});

// Search products
router.get('/search/:query', (req, res) => {
    try {
        const { query } = req.params;
        const searchTerm = query.toLowerCase();
        
        const searchResults = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.ingredients.some(ingredient => 
                ingredient.toLowerCase().includes(searchTerm)
            )
        );
        
        res.json({
            success: true,
            data: searchResults,
            count: searchResults.length,
            query: query
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching products',
            error: error.message
        });
    }
});

module.exports = router; 