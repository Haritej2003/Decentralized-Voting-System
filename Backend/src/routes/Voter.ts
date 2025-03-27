import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import path from "path"
import dotenv from "dotenv"
import express from "express";
import { validateVoterRegistration, validateVoterLogin } from "../middlewares/VerifyVoter";
import { GenerateToken, verifyPassword } from "../middlewares/Authentication";
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const prisma = new PrismaClient();
const router = express.Router();

router.post("/register", validateVoterRegistration, async (req: any, res: any, next: any) => {
  const { name, email, password } = req.body;
  try {

    const salt = await bcrypt.genSalt(Number(process.env.SaltRounds))
    const hashedpassword = await bcrypt.hash(password, salt);
    const user = await prisma.voter.create({
      data: { name, email, password: hashedpassword },
    });
    req.body = { ...req.body, voter: user }
    next();
  } catch (err) {
    res.status(409).json({ error: "User already exists" });
  }
}, GenerateToken);

router.post("/login", validateVoterLogin, async (req: any, res: any, next: any) => {
  const { email } = req.body;
  try {
    const Existingvoter = await prisma.voter.findUnique({ //returns null if no record found
      where: {
        email
      },
    })
    console.log(Existingvoter);
    if (Existingvoter) {

      req.body = { ...req.body, voter: Existingvoter }
      next();
    }
    else {
      console.log("user doesnot exists. Please register ");
      return res.status(404).json({ message: "user doesnot exists. Please register" })
    }
  } catch (error: any) {
    console.error("Unexpected Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}, verifyPassword, GenerateToken);
router.post("/getCandidates", async (req: any, res: any) => {
  try {
    const candidates = await prisma.candidate.findMany();
    if (!candidates) {
      console.log(candidates);
      res.status(200).json({
        message: "No records Found"
      })
    }
    console.log(candidates);
    res.status(200).json({
      message: "Candidate returned successfully",
      candidates
    })
  } catch (error: any) {
    console.error("Unexpected Error:", error.message);
    return res.status(500).json({ error: "Internal server error while fetching candidates" });
  }
})
router.post("/getDetails",async (req:any, res:any) => {
  const id = req.body.id;
  try {
    const Existingvoter = await prisma.voter.findUnique({ //returns null if no record found
      where: {
        id,
        isAdmin:false
      },
    })
    console.log(Existingvoter);
    if (Existingvoter) {

      return res.status(200).json({
        message:"user found",
        voter:{
          name:Existingvoter.name,
          email:Existingvoter.email
        }
      })
    }
    else {
      console.log("user doesnot exists. Please register ");
      return res.status(404).json({ message: "user doesnot exists. Please register" })
    }
  } catch (error: any) {
    console.error("Unexpected Error:", error.message);
    return res.status(500).json({ error: "Internal server error while fetching candidates" });
  }
})
router.post("/getElection",async (req:any,res:any)=>{
  try{
      const id=req.body.id;
      const election = await prisma.elections.findUnique({
          where:{id,
            status:"Ongoing"
          }
      });
      if (!election) {
          console.log(election);
          res.status(400).json({
              message: "No Election Found"
          })
      }
      console.log(election);
      res.status(200).json({
          message: "election returned successfully",
          election
      })
  } catch (error: any) {
      console.error("Unexpected Error:", error.message);
      return res.status(500).json({ error: "Internal server error while fetching election details" });
  }
})
export {
  router as VoterRouter
}


