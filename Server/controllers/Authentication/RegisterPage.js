import bcryptjs from "bcryptjs"
import generateOTP from "../../utils/generateOTP.js"
import {Generate_Json_Web_Token} from '../../cookies/jwtCookie.js'
import { UserModels } from "../../models/userModels.js"
import { SendMail } from "../../nodemailer/mail.config.js"


export const RegisterPage = async (req,res)=>{
    try{
        const {username , email , password , role} = req.body
        if(!username || !password || !email){
            throw new Error ("All fields are required")
        }
        const checkUser = await UserModels.findOne({$or :[{email:email},{username:username}]})
        
        if(checkUser){
            return res.status(409).json({
                message : 'username is already exists'
            })
        }
        const hashPassword =await bcryptjs.hash(password,10)
        const otp = generateOTP()
        const updateUserToDB = await UserModels.create({
            username,
            password:hashPassword,
            role:role || 'user',
            email:email,
            verificationToken:otp,
            verificationTokenExpiresAt:Date.now() + 24 * 60 * 60 * 1000

        });
         const userData = {
            username,
            email,
            role :updateUserToDB.role,
            _id : updateUserToDB._id
         }
        const accessToken =await Generate_Json_Web_Token(res,userData);  
        console.log(updateUserToDB.email);
        const SendStatus = await SendMail(res,updateUserToDB,otp,accessToken)
        console.log(SendStatus);
        
                
    }catch(error){
        console.log(error);
        
        res.status(500)
        .json({
            message:"nothing ",
            status : false,
            Error : error
        })
    }
}