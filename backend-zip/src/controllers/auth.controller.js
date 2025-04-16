const userService=require("../services/user.service.js")
const jwtProvider=require("../config/jwtProvider.js")
const bcrypt=require("bcrypt")
const cartService=require("../services/cart.service.js")
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require('dotenv').config();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify email configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Store reset tokens (in production, use a database)
const resetTokens = new Map();

const register=async(req,res)=>{

    try {
        const user=await userService.createUser(req.body);
        const jwt=jwtProvider.generateToken(user._id);

        await cartService.createCart(user);

        return res.status(200).send({jwt,message:"register success"})

    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}
const login=async(req,res)=>{
    const {password,email}=req.body
    try {
        const user = await userService.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found With Email ', email});
        }

        const isPasswordValid=await bcrypt.compare(password,user.password)

        if(!isPasswordValid){
            return res.status(401).json({ message: 'Invalid password' });
        }

        const jwt=jwtProvider.generateToken(user._id);

        return res.status(200).send({jwt,message:"login success"});

    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await userService.getUserByEmail(email);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found with this email address' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

        // Store the token (in production, save to database)
        resetTokens.set(resetToken, {
            userId: user._id,
            expiry: resetTokenExpiry
        });

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send email with enhanced HTML template
        const mailOptions = {
            from: `"E-commerce Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                    <p style="color: #666;">Hello,</p>
                    <p style="color: #666;">You have requested to reset your password. Click the button below to set a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #9155FD; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
                    </div>
                    <p style="color: #666;">This link will expire in 1 hour for security reasons.</p>
                    <p style="color: #666;">If you didn't request this password reset, please ignore this email.</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email, please do not reply.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ 
            message: 'Password reset link has been sent to your email' 
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ 
            message: 'Error sending reset email. Please try again.' 
        });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    
    try {
        const resetData = resetTokens.get(token);
        
        if (!resetData) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        
        if (Date.now() > resetData.expiry) {
            resetTokens.delete(token);
            return res.status(400).json({ message: 'Reset token has expired' });
        }

        const user = await userService.getUserById(resetData.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user's password
        user.password = hashedPassword;
        await user.save();
        
        // Clear the used token
        resetTokens.delete(token);
        
        return res.status(200).json({ message: 'Password has been reset successfully' });

    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ 
            message: 'Error resetting password. Please try again.' 
        });
    }
};

module.exports={register,login,requestPasswordReset,resetPassword}