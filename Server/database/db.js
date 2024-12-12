import  Mongoose  from "mongoose";

const ConnectDB = async ()=>{
    try{
        Mongoose.connect(process.env.DATABASE_URL_STRING)
        .then(()=>console.log("Database Connected Successfully"))
        .catch((er)=>console.log("Error : ", er))
    }catch(error){
        console.log(error);
        process.exit(1)        
    }
}
export default ConnectDB;
