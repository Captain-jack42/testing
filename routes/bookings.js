const express = require('express');
const router = express.Router();
const { sendBookingConfirmation } = require('../util/emailService');

// Create a new booking
router.post('/api/bookings', async (req, res) => {
    try {
        const bookingData = req.body;
        console.log('Received booking data:', bookingData);
        
        // Validate required fields
        if (!bookingData.email || !bookingData.service || !bookingData.startDate || !bookingData.endDate) {
            console.error('Missing required fields:', bookingData);
            return res.status(400).json({
                success: false,
                message: 'Missing required booking information'
            });
        }
        
        // Send confirmation email
        console.log('Attempting to send confirmation email to:', bookingData.email);
        const emailSent = await sendBookingConfirmation(bookingData);
        
        if (emailSent) {
            console.log('Booking successful and email sent');
            res.json({
                success: true,
                message: 'Booking confirmed and confirmation email sent',
                bookingId: Date.now() // In a real app, this would be the database ID
            });
        } else {
            console.error('Failed to send confirmation email');
            res.status(500).json({
                success: false,
                message: 'Booking confirmed but failed to send confirmation email'
            });
        }
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process booking',
            error: error.message
        });
    }
});

module.exports = router; 