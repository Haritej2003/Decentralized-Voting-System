import {atom} from "recoil";
interface CandidateData {
    id: number
    name: string;
    partyName: string;
}

export const candidateAtom=atom<CandidateData[]>({
    key:"candidateAtom",
    default:[]
})
export const showCandidatesAtom=atom<boolean>({
    key:"showCandidatesAtom",
    default:false
})
export const showVoteButtonsAtom=atom<boolean>({
    key:"showVoteButtonsAtom",
    default:true
})
interface Election {
    name: string;
    startDate: Date;  
    endDate: Date;    
    startTime: string; 
    endTime: string;
    status: string;   
}

export const NewElection = atom<Election>({
    key: "showVoteButtonsAtom",
    default: {
        name: "",
        startDate: new Date(),  // Defaults to the current date
        endDate: new Date(),    // Defaults to the current date
        startTime: "00:00",     // Default start time
        endTime: "23:59",      // Default end time
        status:"Ongoing"
    }
});

export const ElectionProgress=atom<boolean>({
    key:"ElectionProgress",
    default:false
})