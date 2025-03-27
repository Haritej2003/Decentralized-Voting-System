import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import path from "path"
import dotenv from "dotenv"
import express from "express";
import { validateVoterRegistration, validateVoterLogin } from "../middlewares/VerifyVoter";
import { GenerateToken, verifyPassword, verifyToken } from "../middlewares/Authentication";
import { VerifyCandidate } from "../middlewares/VerifyCandidate";

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const prisma = new PrismaClient();
const router = express.Router();

router.post("/register", validateVoterRegistration, async (req: any, res: any, next: any) => {
    const { name, email, password } = req.body;
    try {

        const salt = await bcrypt.genSalt(Number(process.env.SaltRounds));
        const hashedpassword = await bcrypt.hash(password, salt);
        const user = await prisma.voter.create({
            data: { name, email, password: hashedpassword, isAdmin: true },
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
                email,
                isAdmin: true
            },

        })
        console.log(Existingvoter);
        if (Existingvoter) {

            req.body = { ...req.body, voter: Existingvoter }
            next();
        }
        else {
            console.log("admin doesnot exists. Please register ");
            return res.status(401).json({ message: "Access Denied. Admins only Or Incorrect email or password" })
        }
    } catch (error: any) {
        console.error("Unexpected Error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}, verifyPassword, GenerateToken);





router.post("/addCandidate", VerifyCandidate, async (req: any, res: any) => {
    const { name, partyName } = req.body;
    try {
        const candidate = await prisma.candidate.create({
            data: {
                name, partyName
            },

        })
        console.log("Added candidate is", candidate);
        res.status(200).json({
            message: "Candidate successfully added",
            candidate
        })
    } catch (error: any) {
        console.error("Unexpected Error:", error.message);
        return res.status(500).json({ error: "Internal server error while adding candidate" });
    }
})

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
router.post("/updateCandidate", VerifyCandidate, async (req: any, res: any) => {
    const { name, partyName, id } = req.body;
    try {
        const candidate = await prisma.candidate.update({
            where: {
                id
            },
            data: {
                name, partyName, id
            }
        })

        console.log(candidate);
        res.status(200).json({
            message: "Candidate updated successfully"
        })
    } catch (error: any) {
        console.error("Unexpected Error:", error.message);
        return res.status(400).json({ error: "No record Found" });
    }
})
router.post("/deleteCandidate", async (req: any, res: any) => {
    const { id } = req.body;
    try {
        const candidate = await prisma.candidate.delete({
            where: {
                id
            },

        })
        console.log(candidate);
        res.status(200).json({
            message: "Candidate deleted successfully"
        })
    } catch (error: any) {
        console.error("Unexpected Error:", error.message);
        return res.status(500).json({ error: "No record Found" });
    }
})
router.post("/getElectionDetails", async (req, res) => {
    try {
        const statusCounts = await prisma.elections.groupBy({
            by: ["status"],
            _count: {
                status: true,
            },
        });

        console.log(statusCounts);
        const result: Record<string, number> = {};

        statusCounts.forEach((item) => {
            result[item.status] = item._count.status;
        });


        res.status(200).json(result);


    }
    catch (error: any) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
})
router.post("/createElection", async (req, res) => {
    try{
    const { name, startDate, endDate, startTime, endTime } = req.body;

        // Convert string dates to Date objects
        const formattedStartDate = new Date(`${startDate}T00:00:00Z`);
        const formattedEndDate = new Date(`${endDate}T00:00:00Z`);

        const election = await prisma.elections.create({
            data: {
                name,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                startTime,
                endTime,
                status: "Ongoing",
            },
        });
        console.log("Added election is", election);
        res.status(200).json({
            message: "Candidate successfully added",
            election
        })
    } catch (error: any) {
        console.log("error occured")
    }
})
router.post("/getElection",async (req:any,res:any)=>{
    try{
        const id=req.body.id;
        const election = await prisma.elections.findUnique({
            where:{id}
        });
        if (!election) {
            console.log(election);
            res.status(200).json({
                message: "No records Found"
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
router.post("/endElection",async (req:any,res:any)=>{
        try{
            const id=req.body.id;
            const election = await prisma.elections.update({
                where: {
                    id
                },
                data: {
                    status:"Completed"
                }
            })
    
            console.log(election);
            res.status(200).json({
                message: "Election ended successfully"
            })
        } catch (error: any) {
            console.error("Unexpected Error:", error.message);
            return res.status(400).json({ error: "No record Found" });
        }

        
})
export {
    router as AdminRouter
}


