import { Generate_Json_Web_Token } from "../../cookies/jwtCookie.js";
import { UserModels } from "../../models/userModels.js";
import generateOTP from "../../utils/generateOTP.js";
import { SendMail } from "../../nodemailer/mail.config.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export const ResetPassword_Authentication = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email

        
        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }

        const otp = generateOTP();
        const updateUserToDB = await UserModels.findOne({ email });

        if (!updateUserToDB) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const userData = {
            username: updateUserToDB.username,
            email,
            role: updateUserToDB.role,
            _id: updateUserToDB._id,
        };

        const accessToken = await Generate_Json_Web_Token(res, userData);

        // Hash the OTP before saving it
        const hashedOtp = bcryptjs.hashSync(otp, 10);

        await UserModels.findByIdAndUpdate(updateUserToDB._id, {
            verificationToken: hashedOtp,
            verificationTokenExpiresAt: Date.now() + 1 * 60 * 60 * 1000, // 1 hour
        });

        await SendMail(res, updateUserToDB, otp, accessToken);

        res.status(200).json({ message: "OTP sent successfully", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred", success: false });
    }
};

export const ResetPassword_Confirm = async (req, res) => {
    try {
        const { password, otp } = req.body;
        const Token = req.cookies.token;

        // Validate inputs
        if (!password || !otp) {
            return res.status(400).json({ message: "Password and OTP are required", success: false });
        }

        if (!Token) {
            return res.status(403).json({ message: "Token is missing", success: false });
        }

        const checkToken = jwt.verify(Token, process.env.JWT_KEY);

        const updateUserToDB = await UserModels.findById(checkToken._id);

        if (!updateUserToDB) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Verify OTP
        const isOtpValid = bcryptjs.compareSync(otp, updateUserToDB.verificationToken);
        if (!isOtpValid || updateUserToDB.verificationTokenExpiresAt < Date.now()) {
            return res.status(401).json({ message: "Invalid or expired OTP", success: false });
        }

        // Hash the new password
        const hashPassword = await bcryptjs.hash(password, 10);

        await UserModels.findByIdAndUpdate(checkToken._id, {
            password: hashPassword,
            verificationToken: null,
            verificationTokenExpiresAt: null,
        });

        const userData = {
            username: updateUserToDB.username,
            email: updateUserToDB.email,
            role: updateUserToDB.role,
            _id: updateUserToDB._id,
        };

        const accessToken = await Generate_Json_Web_Token(res, userData);

        res.status(200).json({
            message: "Password changed successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred", success: false });
    }
};
