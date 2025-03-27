import { ethers } from "ethers";
import { Request, Response } from "express";
import dotenv from "dotenv";
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// 🔹 Load environment variables
const CONTRACT_ADDRESS: string = process.env.contractAddress || "";
const PRIVATE_KEY: string = process.env.ADMIN_PRIVATE_KEY || "";
const RPC_URL: string = process.env.RPC_URL || "";

// 🔹 Ensure environment variables are set
if (!CONTRACT_ADDRESS || !PRIVATE_KEY || !RPC_URL) {
    throw new Error("Missing required environment variables!");
}

// 🔹 Load ABI from compiled contract JSON
const contractArtifactPath = path.resolve(__dirname, "../../../blockchain/artifacts/contracts/Voting.sol/Voting.json");

// Read the JSON file
const contractArtifact = JSON.parse(fs.readFileSync(contractArtifactPath, "utf8"));

const contractABI = contractArtifact.abi;

// 🔹 Set up Ethereum provider & wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

// 🔹 Define request body types
interface VoteRequestBody {
    voterId: string;
    candidateId: string;
    partyName: string;
    date: string;
}

// 🔹 Function to cast a vote
export const castVote = async (req: Request, res: Response) => {
    try {
        const { voterId, candidateId, partyName, date } = req.body as VoteRequestBody;

        // Call the contract's castVote function
        if (!voterId || !candidateId || !partyName || !date) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }
        
        const tx = await contract.castVote(voterId, candidateId, partyName, date);
        await tx.wait(); // Wait for transaction confirmation

        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        console.error("Error in castVote:", error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
};

// 🔹 Function to get votes for a candidate
export const getVotesForCandidate = async (req: Request, res: Response) => {
    try {
        const { candidateId } = req.params;
        if (!candidateId) {
            return res.status(400).json({ success: false, error: "Candidate ID is required" });
        }
        const votes = await contract.getVotesForCandidate(candidateId);
        res.json({ success: true, votes: votes.toString() });
    } catch (error) {
        console.error("Error in getVotesForCandidate:", error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
};

// 🔹 Function to get total number of voters
export const getTotalVoters = async (req: Request, res: Response) => {
    try {
        const totalVoters = await contract.getTotalVoters();
        res.json({ success: true, totalVoters: totalVoters.toString() });
    } catch (error) {
        console.error("Error in getTotalVoters:", error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
};
