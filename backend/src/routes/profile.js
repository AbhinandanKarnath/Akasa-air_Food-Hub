const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        const userProfile = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            joinDate: user.createdAt
        };

        res.json({
            success: true,
            data: userProfile
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching user profile' 
        });
    }
});

// Update user profile
router.put('/', authenticateToken, async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        
        // Check if email is being changed and if it already exists
        if (email !== req.user.email) {
            const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { name, email, phone, address },
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                joinDate: updatedUser.createdAt
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Verify current password
        const user = await User.findById(req.user._id);
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password'
        });
    }
});

module.exports = router;