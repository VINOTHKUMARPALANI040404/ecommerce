import jwt from 'jsonwebtoken'
export const HomePage = async (req,res)=>{
    try{
        // const token = req.cookies.token
        // const decoded = await jwt.verify(token,process.env.JWT_KEY,{complete:true})
        // if(!decoded){
        //     return res.status(404).json({
        //         message:"cookie is not matched",
        //         success : true
        //     })
        // }
        // console.log(decoded.role === 'user');
         
        
        
        res.status(200)
        .json({
            message : "Welcome to Home Page",
            status : 200,
            data:res.body
        })
    }catch(err){
        res.status(500)
        .json({
            message:err,
            status : 500
            
        })
    }
}
