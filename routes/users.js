const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Sample users data (in a real app, this would come from a database)
let users = [];

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            phone: phone || '',
            address: address || {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            preferences: {
                newsletter: true,
                notifications: true
            }
        };

        users.push(newUser);

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
});

// Get user profile
router.get('/profile/:id', (req, res) => {
    try {
        const { id } = req.params;
        const user = users.find(u => u.id === id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
            success: true,
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message
        });
    }
});

// Update user profile
router.patch('/profile/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, address, preferences } = req.body;
        
        const user = users.find(u => u.id === id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Update fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = { ...user.address, ...address };
        if (preferences) user.preferences = { ...user.preferences, ...preferences };
        
        user.updatedAt = new Date().toISOString();
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
});

// Change password
router.patch('/profile/:id/password', async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;
        
        const user = users.find(u => u.id === id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        // Hash new password
        const saltRounds = 10;
        user.password = await bcrypt.hash(newPassword, saltRounds);
        user.updatedAt = new Date().toISOString();
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
});

module.exports = router; 