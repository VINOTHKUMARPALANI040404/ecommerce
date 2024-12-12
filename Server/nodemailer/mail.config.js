import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const SendMail = async (res, userData, otp,accessToken) => {
    try {
        const { _id, email, role, username } = userData;

        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender's email
            to: email,                    // Recipient's email
            subject: "Verify Your Email",
            text: `Hello ${username},\n\nYour OTP for email verification is: ${otp}\n\nThis OTP is valid for 24 hours.\n\nThank you!`,
        };

        // Send the email
        const result = await transporter.sendMail(mailOptions);

        if (result.accepted.includes(email)) {
            console.log(`Email successfully sent to ${email}`);

            res.status(200).json({
                message: "Email sent successfully",
                success: true,
                data:{
                    username,
                    _id,
                    email,
                    role,
                    accessToken,
                }
            });
        } else {
            throw new Error("Failed to send email");
        }

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Error occurred while sending the email",
            success: false,
            error: err.message,
        });
    }
};
