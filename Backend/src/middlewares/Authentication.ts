const jwt=require("jsonwebtoken");
const path=require("path")
import bcrypt from "bcrypt"
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const GenerateToken = (req:any,res:any)=>{
    try{
        const {email}=req.body;
        const value={
        email
        }
    const token=jwt.sign(value,process.env.JWTPassword,{expiresIn:'1h'})
    res.status(201).json({
        success:true,
        message:"Voter added successfully and token is sent",
        token:token,
        voter:req.body.voter
    })
    }
    catch(error:any){
        console.log(error.message)
        res.status(500).json({ message: "error while adding user in token" })
    }
}
const verifyPassword = async (req:any,res:any,next:any)=>{
    const {password}=req.body;
    const hashedPassword=req.body.voter.password;
    try{
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err) {
                console.log("error while verifying user ", err.message);
                res.status(404).json({ message: "error while verifying user" })
                return;
            }
            if (result) {
                console.log("User verified and logged in")
                next();
            } else {
                console.log("Password mismatch");
                res.status(401).json({ message: "Invalid password" });
            }
        })
    }catch(error:any){
        console.error("Unexpected Error:", error.message);
        return res.status(400).json({ error: "Error while verifying password" });
    }
}
const verifyToken = (req:any,res:any,next:any)=> {
  try{
        const token=req.headers.authorization?.split(' ')[1]; //The ?. operator is used to safely access deeply nested properties without causing an error if one of the properties in the chain is null or undefined
        if (!token) {
            return res.status(400).json({ message: 'Access Denied. No token provided.' });
          }
        jwt.verify(token,process.env.JWTPassword,function (err:any,decoded:any){
            if(err){
                console.log("error while verifying admin");
                res.status(400).json({message:"Session expired. Please Login again"});
                return;
            }
            if(decoded){
                console.log("admin token is verified");                
                next();
            }
            else{
                console.log("admin token is not valid");
                res.status(400).json({message:"admin token is not valid"})
            }
        })

  }catch(error:any){
    console.log("error while verifying token",error.message);
    res.status(400).json({
        message:"token verification failed"
    })
  }
}
export {
    GenerateToken,verifyPassword,verifyToken
}