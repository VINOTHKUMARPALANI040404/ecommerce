import jwt from "jsonwebtoken";
import { UserModels } from "../../models/userModels.js";
import { Generate_Json_Web_Token } from "../../cookies/jwtCookie.js";

export const verifyOtp = async (req, res) => {
    try {
    const token = req.cookies.token
    if (!token) {
        return res.status(409).json({
            message: "Invalid authentication",
            success: false,
        });
    }
        const verifyToken = jwt.verify(token, process.env.JWT_KEY);
        console.log(verifyToken);
        const { email, otp, _id } = req.body;
        const checkUser = await UserModels.findOne({
            $or: [{ email: email }, { _id: _id }],
        });
        console.log(checkUser);
        
        if (!checkUser) {
            return res.status(409).json({
                message: "Invalid authentication",
                success: false,
            });
        }
        const CheckOTP = checkUser.verificationToken == otp;
        if (!CheckOTP) {
            return res.status(403).json({
                message: "Invalid OTP",
                success: false,
            });
        }
        checkUser.isVerified = true;
        checkUser.verificationToken = ""
        checkUser.verificationTokenExpiresAt = Date.now;
        UserModels.findByIdAndUpdate(checkUser._id,{
            isVerified: true,
            verificationToken: "",
            verificationTokenExpiresAt:Date.now(),
            },{new:true});
        const accessToken =await Generate_Json_Web_Token(res,userData);
        res.status(201).json({
            message: "user authenticated successfully",
            data: {...checkUser,accessToken}
        });
    } catch (err) {
        console.log(err);
        
        res.status(500).json({
            message: "error occurred",
            success: false,
        });
    }
};
