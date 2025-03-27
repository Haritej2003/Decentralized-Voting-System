import {ethers} from 'ethers'
import dotenv from "dotenv";
import path from "path";
import fs from 'fs'
// Load contract artifact
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
if (!process.env.contractAddress || !process.env.RPC_URL) {
    throw new Error("Missing contractAddress or RPC_URL in .env file");
}


// Read the JSON file
const contractAddress=process.env.contractAddress!;
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const contractArtifactPath = path.resolve(__dirname, "../../../blockchain/artifacts/contracts/Voting.sol/Voting.json");
if (!fs.existsSync(contractArtifactPath)) {
    throw new Error("Contract artifact not found. Run 'truffle compile' or 'hardhat compile'.");
}
const contractArtifact = JSON.parse(fs.readFileSync(contractArtifactPath, "utf8"));
const contractABI = contractArtifact.abi;

async function getVotesForCandidate(candidateId: string): Promise<number> {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const votes = await contract.getVotesForCandidate(candidateId);
    return Number(votes.toString());
}
async function getTotalVoters(): Promise<number> {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const total = await contract.getTotalVoters();
    return Number(total.toString());
}

export { getVotesForCandidate, getTotalVoters };