import  mongoose, {Schema}  from "mongoose";

const userDetails = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
        unique : true,
    },
    role : {
        type : String,
        default : 'user'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    lastLogin:{
        type : Date,
        default :Date.now,
    },
    isVerified : {
        type:Boolean,
        default:false
    },
    resetPasswordToken :String,
    resetPasswordExpiresAt : Date,
    verificationToken : String,
    verificationTokenExpiresAt:Date
},{timestamps:true })

export const UserModels =  mongoose.model('users',userDetails);
