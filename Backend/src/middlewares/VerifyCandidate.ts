import {z} from "zod";
const Candidate=z.object({
    name: z.string(
        {required_error: "Name is required",
            invalid_type_error: "Name must be a string",}
    ).regex(/^[A-Za-z\s]+$/,{message: "Only alphabets and spaces are allowed"}),
    partyName:z.string(
        {required_error: "Party Name is required",
            invalid_type_error: "Party Name must be a string",}
    ).regex(/^[A-Za-z\s]+$/,{message: "Only alphabets and spaces are allowed"}),
          
})
const VerifyCandidate = (req:any,res:any,next:any)=>{
    try{
        const verify = Candidate.safeParse(req.body);
        if(!verify.success){
            console.error("Validation Errors: ",verify.error.errors);
            return res.status(400).json({
               message:"Only alphabets and spaces are allowed"
            })
        }
        next();
    }
    catch(error:any){
        console.error("Unexpected Error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export {VerifyCandidate}