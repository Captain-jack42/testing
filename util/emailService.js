const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports like 587
    auth: {
        user: 'RajanSingh8593@gmail.com',
        pass: 'madv cxri ytuv etqu' // Replace this with your actual App Password
    }
});

// Test the connection
transporter.verify(function(error, success) {
    if (error) {
        console.log("Server Error:", error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

// Function to send booking confirmation email
const sendBookingConfirmation = async (bookingData) => {
    try {
        const {
            email,
            service,
            duration,
            travelers,
            startDate,
            endDate,
            amount
        } = bookingData;

        console.log('Attempting to send email to:', email);
        console.log('Booking details:', { service, duration, travelers, startDate, endDate, amount });

        // Format dates
        const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Create email content
        const mailOptions = {
            from: '"Yatra Travel" <RajanSingh8593@gmail.com>',
            to: email,
            subject: 'Booking Confirmation - Yatra',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb; text-align: center;">Booking Confirmation</h2>
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #1e293b; margin-bottom: 15px;">Dear Valued Customer,</h3>
                        <p>Thank you for choosing Yatra! Your booking has been confirmed. Here are your booking details:</p>
                        
                        <div style="margin: 20px 0; padding: 15px; background-color: white; border-radius: 6px; border: 1px solid #e2e8f0;">
                            <p><strong>Package/Service:</strong> ${service}</p>
                            <p><strong>Duration:</strong> ${duration}</p>
                            <p><strong>Number of Travelers:</strong> ${travelers}</p>
                            <p><strong>Travel Dates:</strong> ${formattedStartDate} to ${formattedEndDate}</p>
                            <p><strong>Total Amount:</strong> ₹${amount.toLocaleString()}</p>
                        </div>

                        <p>Important Information:</p>
                        <ul style="color: #475569;">
                            <li>Please arrive at the designated location 30 minutes before the scheduled time</li>
                            <li>Carry a valid ID proof for verification</li>
                            <li>Keep this confirmation email handy during your travel</li>
                        </ul>

                        <p style="margin-top: 20px;">If you have any questions or need assistance, please don't hesitate to contact our support team:</p>
                        <p>Email: support@yatra.com<br>Phone: +91 1234567890</p>

                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #64748b; font-size: 14px;">This is an automated message, please do not reply to this email.</p>
                        </div>
                    </div>
                </div>
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Error details:', error.message);
        return false;
    }
};

module.exports = {
    sendBookingConfirmation
}; 