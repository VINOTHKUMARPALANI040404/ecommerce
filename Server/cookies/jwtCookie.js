import jwt from 'jsonwebtoken'

export const Generate_Json_Web_Token =(res,userData)=>{ 
    
    const token = jwt.sign(userData,process.env.JWT_KEY,{expiresIn:'15d'})

    res.cookie("token",token,{
        httpOnly:true,
        secure : process.env.NODE_MODE === "production",
        maxAge : 2 * 24 * 60 * 60 * 1000,
        sameSite : "strict"
    })
    return token;
}
