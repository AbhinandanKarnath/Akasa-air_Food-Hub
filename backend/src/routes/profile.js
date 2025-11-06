const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const auth = require('../middleware/auth');  // ✅ Changed this line

const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {  // ✅ Changed authenticateToken to auth
    try {
        const user = await User.findById(req.user._id || req.user.id).select('-password');
        
        const userProfile = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
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
router.put('/', auth, async (req, res) => {  // ✅ Changed authenticateToken to auth
    try {
        const { name, email, phone, address } = req.body;
        
        const userId = req.user._id || req.user.id;
        const currentUser = await User.findById(userId);
        
        // Check if email is being changed and if it already exists
        if (email !== currentUser.email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
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
router.put('/password', auth, async (req, res) => {  // ✅ Changed authenticateToken to auth
    try {
        const { currentPassword, newPassword } = req.body;

        const userId = req.user._id || req.user.id;

        // Verify current password
        const user = await User.findById(userId);
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
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

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