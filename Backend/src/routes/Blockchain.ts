// const express = require("express");
// const router = express.Router();
// // const voteController = require("../controllers/voteController");

// // router.post("/cast-vote", voteController.castVote);
// // router.get("/votes", voteController.getAllVotes);

// // export{
// //     router as BlockchainRouter
// // } 
// const express = require("express");
// const { ethers } = require("ethers");
// const fs = require("fs");
// const path = require("path");
// require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// const router = express.Router();

// // Load contract ABI
// const contractPath = path.join(__dirname, "../../../../blockchain/artifacts/contracts/Voting.sol/Voting.json");
// const contractABI = JSON.parse(fs.readFileSync(contractPath, "utf8")).abi;

// // Connect to Ethereum provider
// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
// const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
// const votingContract = new ethers.Contract(process.env.contractAddress, contractABI, wallet);

// // POST route to cast vote
// router.post("/cast", async (req: any, res: any) => {
//     try {
//         const { voterId, candidateId, partyName } = req.body;

//         if (!voterId || !candidateId || !partyName) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         // Generate the current date in YYYY-MM-DD format
//         const date = new Date().toISOString().split("T")[0];
//         if (!process.env.contractAddress) {
//             throw new Error("Contract address is not defined in environment variables.");
//         }
//         const balance = await provider.getBalance(wallet.address);
//         console.log(`Admin Wallet Balance: ${ethers.formatEther(balance)} ETH`);
//         console.log(`Wallet Address: ${wallet.address}`);

//         console.log(`Casting vote for: ${voterId} -> ${candidateId} (${partyName}) on ${date}`);
//         console.log("Contract Address:", process.env.contractAddress);
//         console.log("RPC URL:", process.env.RPC_URL);
//         console.log("Admin Private Key Length:", process.env.ADMIN_PRIVATE_KEY!.length);
//         // Send transaction to blockchain
//         console.log("Contract ABI Path:", contractPath);
//         console.log("ABI Exists:", fs.existsSync(contractPath));
//         console.log("Submitting transaction...");
//         const tx = await votingContract.castVote(voterId, candidateId, partyName, date, {
//             gasLimit: 3000000,  // Set an appropriate gas limit
//             maxFeePerGas: ethers.parseUnits("50", "gwei"),  
//     maxPriorityFeePerGas: ethers.parseUnits("2", "gwei") 
//         });
//         console.log("Transaction submitted:", tx.hash);
//         await tx.wait(1);
//         console.log("Transaction confirmed!");

//         res.json({ success: true, message: "Vote recorded successfully!", transactionHash: tx.hash });
//     } catch (error: any) {
//         if (error.reason === "Voter has already voted!") {
//             return res.status(400).json({ error: "Voter has already voted!" });
//         }
//         console.error("Error casting vote:", error);
//         res.status(500).json({ error: "Failed to cast vote", details: error.message });
//     }
// });

// export {
//     router as BlockchainRouter
// };





import express, { Request, Response } from "express";
import { ethers, Contract, JsonRpcProvider, Wallet } from "ethers";
import { keccak256, toUtf8Bytes } from "ethers";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path'
import fs from 'fs'
import { PrismaClient } from "@prisma/client";
dotenv.config();
const prisma=new PrismaClient();
const router = express.Router();
const contractPath = path.join(__dirname, "../../../../blockchain/artifacts/contracts/Voting.sol/Voting.json");
const abi = JSON.parse(fs.readFileSync(contractPath, "utf8")).abi;
const RPC_URL: string | undefined = process.env.RPC_URL;
const PRIVATE_KEY: string | undefined = process.env.ADMIN_PRIVATE_KEY;
const CONTRACT_ADDRESS: string | undefined = process.env.contractAddress;
if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
    throw new Error("Missing required environment variables.");
}
// // Connect to Ethereum provider
// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const provider: JsonRpcProvider = new ethers.JsonRpcProvider(RPC_URL); // Ganache RPC
const wallet: Wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

// **API to cast a vote**
router.post("/cast", async (req: any, res: any) => {
    const { voterId, candidateId, partyName } = req.body;
    if (!voterId || !candidateId || !partyName) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const date = new Date().toISOString().split("T")[0];
    try {
        console.log(`Casting vote for: ${voterId} -> ${candidateId} (${partyName}) on ${date}`);
        const tx = await contract.castVote(voterId, String(candidateId), partyName, date);
        await tx.wait();
        res.json({ success: true, message: "Vote successfully cast!", transactionHash: tx.hash  });
    } catch (error: any) {
        console.error("Error casting vote:", error);
        if (error.reason === "Voter has already voted!") {
            return res.status(400).json({ error: "Voter has already voted!" });
        }
        
        res.status(500).json({ error: "Failed to cast vote", details: error.message });
    }
});

router.post("/getStats", async (req: any, res: any) => {
        try {
            // Fetch total voters in PostgreSQL using Prisma
            const totalRegisteredVoters = await prisma.voter.count({
                where: {
                  isAdmin: false
                }});
        
            // Fetch total voters who voted from Blockchain
            const totalVotersOnChain = await contract.getTotalVoters();
        
            res.json({
              totalRegisteredVoters,
              totalVotersOnChain: Number(totalVotersOnChain)
            });
        
          } catch (error:any) {
            console.error("Error fetching voter stats:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
          }
});

router.post("/hasVoted", async (req: any, res: any) => {
    try {
        const id=req.body.id;
        // Fetch total voters in PostgreSQL using Prisma
        
    
        // Fetch total voters who voted from Blockchain
        const HasVoted = await contract.hasVoted(String(id));
    
        res.json({
          HasVoted
        });
    
      } catch (error) {
        console.error("Error fetching voter status:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
});
router.get("/all-votes", async (req, res) => {
    try {
        // **Step 1: Fetch all candidate IDs from the database**
        const candidates = await prisma.candidate.findMany();

        let results = [];
        
        // **Step 2: Loop through candidates & get votes from blockchain**
        for (const candidate of candidates) {
            try {
                
                const votes = await contract.getVotesForCandidate(String(candidate.id));
                results.push({ candidateId: candidate.id, name: candidate.name, party: candidate.partyName, votes:Number(votes) });
            } catch (err) {
                console.error(`Error fetching votes for ${String(candidate.id)}:`, err);
                results.push({ candidateId: candidate.id, name: candidate.name, party: candidate.partyName, votes: 0 }); // Default to 0
            }
        }

        res.json({ totalCandidates: candidates.length, results });
    } catch (error) {
        console.error("Error fetching votes:", error);
        res.status(500).json({ error: "Failed to fetch votes" });
    }
});
export {
    router as BlockchainRouter
}



