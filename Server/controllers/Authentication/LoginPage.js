import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { UserModels } from '../../models/userModels.js';
import { Generate_Json_Web_Token } from '../../cookies/jwtCookie.js';

export const LoginPage = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({
                message: "Token missing in request",
                success: false
            });
        }
        const checkUser = jwt.verify(token, process.env.JWT_KEY);
        if (!checkUser) {
            return res.status(403).json({
                message: "Invalid or expired token",
                success: false
            });
        }
        const storedUser = await UserModels.findOne({ email });
        if (!storedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Compare the provided password with the stored hashed password
        bcryptjs.compare(password, storedUser.password, async (err, isMatch) => {
            if (err) {
                return res.status(500).json({
                    message: "Error during password comparison",
                    success: false
                });
            }
            if (!isMatch) {
                return res.status(403).json({
                    message: "Invalid password",
                    success: false
                });
            }
            await UserModels.findByIdAndUpdate(storedUser._id,{
                verificationToken:"",
                lastLogin:Date.now(),
                verificationTokenExpiresAt:Date.now(),
            },{new:true})
            Generate_Json_Web_Token(res,{_id:storedUser._id,email:storedUser.email,role:storedUser.role})
            res.status(200).json({
                message: "User authenticated successfully",
                success: true
            });
        });

    } catch (error) {
        res.status(500).json({
            message: "Error occurred during login",
            success: false,
            error: error.message,
        });
    }
};
