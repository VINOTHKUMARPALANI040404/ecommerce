import jwt from 'jsonwebtoken'
export const AdminPage = async (req,res)=>{
    try{
        res.status(200)
        .json({
            message : "Welcome to Admin Page",
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
