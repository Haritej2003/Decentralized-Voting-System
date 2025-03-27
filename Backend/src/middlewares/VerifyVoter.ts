import {z} from "zod";
const VoterRegister=z.object({
    name: z.string(
        {required_error: "Name is required",
            invalid_type_error: "Name must be a string",}
    ).regex(/^[A-Za-z\s]+$/,{message: "Only alphabets and spaces are allowed"}),
    email : z.string({required_error: "Email is required",
        invalid_type_error: "Email must be a string"})
        .email({ message: "Invalid email address" }),
    password : z.string().regex(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {message:"Password must be at least 8 characters long and contain at least one letter, one number, and one special character."}
          )
          
})
const validateVoterRegistration = (req:any,res:any,next:any)=>{
    try{
        const verify = VoterRegister.safeParse(req.body);
        if(!verify.success){
            console.error("Validation Errors: ",verify.error.errors);
            return res.status(422).json({
                errors: verify.error.errors.map(err => ({
                    path: err.path.join("."), // Field name
                    message: err.message      // Validation message
                }))
            })
        }
        next();
    }
    catch(error:any){
        console.error("Unexpected Error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}



const VoterLogin=z.object({
    email : z.string({required_error: "Email is required",
        invalid_type_error: "Email must be a string"})
        .email({ message: "Invalid email address" }),
    password : z.string({required_error: "Password is required"})
          
})
const validateVoterLogin = (req:any,res:any,next:any)=>{
    try{
        const verify = VoterLogin.safeParse(req.body);
        if(!verify.success){
            console.error("Validation Errors: ",verify.error.errors);
            return res.status(422).json({
                errors: verify.error.errors.map(err => ({
                    path: err.path.join("."), // Field name
                    message: err.message      // Validation message
                }))
            })
        }
        next();
    }
    catch(error:any){
        console.error("Unexpected Error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export {
    validateVoterRegistration, validateVoterLogin
}