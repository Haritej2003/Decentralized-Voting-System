import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from 'recoil';
import axios from "axios";
import { Check, X } from 'lucide-react';
import { candidateAtom } from '../Atoms/CandidatesAtom';
import {useHasVoted} from '../Atoms/contextAPI';
import '../styles/ViewCandidate.css';

interface CandidateData {
    id: number;
    name: string;
    partyName: string;
    showVoteButtons: boolean;
}

export default function CandidatesList({ showVoteButtons, candidatesRef }: any) {
    const [candidates, setCandidates] = useRecoilState(candidateAtom);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateData | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [voted,setVoted]=useState(false);
    const { hasVoted,updateHasVoted } = useHasVoted();
     
    const getCandidates = useCallback(async function () {
        try {
            setLoading(true);
            setError("");
            const data = await axios.post("http://localhost:5000/voter/getCandidates");
            console.log("Candidates obtained", data);
            if (data.status === 200)
                setCandidates(data.data.candidates);
            const voted=await axios.post("http://localhost:5000/blockchain/hasVoted",{id:localStorage.getItem("VoterId")});
            if(voted.data.HasVoted){
                updateHasVoted(true);
            }
        } catch (error: any) {
            console.log(error.message);
            if (error.response) {
                if (error.response.status === 400) {
                    console.log(error.response.data.message);
                }
                else if (error.response.status === 500) {
                    console.log("Internal Server error");
                }
            }
            else {
                console.log(error.response?.data?.message || error.message || "Invalid format");
            }
            setError(error.response?.data?.message || error.message || "Invalid format");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getCandidates();
    }, [getCandidates]);
    
    const handleVoteClick = (candidate: CandidateData) => {
        setSelectedCandidate(candidate);
        setShowConfirmation(true);
    };

    const handleConfirmVote = async () => {
        try{
            setLoading(true)
            const data={
                voterId:localStorage.getItem("VoterId"),
                candidateId:selectedCandidate?.id,
                partyName:selectedCandidate?.partyName
            }
            const res=await axios.post("http://localhost:5000/blockchain/cast",data);
            
            console.log("selected candidate is",selectedCandidate);
            localStorage.setItem("selectedCandidate",selectedCandidate?.id)
            setShowConfirmation(false);
            setShowSuccess(true);
           updateHasVoted(true);
            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
                setSelectedCandidate(null);
            }, 3000);
        }catch(error:any){
            console.log("error occured5555",error.message);
            setError("You have already casted your vote");
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="list-container">
            {/* Success Message */}
            {showSuccess && (
                <div className="notify">
                    <Check size={24} />
                    <div>
                        <p className="p1">Vote Confirmed!</p>
                        <p className="p2">Your vote has been successfully cast for {selectedCandidate?.name}</p>
                    </div>
                </div>
            )}

            <div ref={candidatesRef} className="CandidateContainer">
                <h1>Candidates List</h1>
                {loading ? (
                    <h2>Loading...</h2>
                ) : candidates.length !== 0 ? (
                    <div className="CandidateListContainer">
                        {candidates.map(candidate => (
                            <Candidate
                                key={candidate.id}
                                {...candidate}
                                showVoteButtons={showVoteButtons}
                                onVoteClick={() => handleVoteClick({...candidate,showVoteButtons})}
                                selectedCandidate={selectedCandidate?.id}
                                hasVoted={hasVoted}
                                />
                        ))}
                    </div>
                ) : (
                    <h2>No Candidates Found</h2>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && selectedCandidate && (
                <div className="modal-container">
                    <div className="modal">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h3 >Confirm Your Vote</h3>
                        </div>

                        {/* Candidate Details */}
                        <div className="modal-details">
                            <div style={{"display":"flex","marginLeft":"1.5rem","alignItems":"center"}}>
                                <div className="image-container">
                                    <img src="Flag.png" alt="Flag" style={{"objectFit":"cover","borderRadius":"9999px","borderWidth":"4px","width":"6rem","height":"6rem"}} />
                                </div>
                                <div className="modal-candidate">
                                    <h4 style={{"fontSize":"1.5rem","fontWeight":"600","color":"#1F2937","margin":"0"}}>{selectedCandidate.name}</h4>
                                    <p style={{"color":"#4B5563","fontSize":"1.25rem","margin":"0"}}>{selectedCandidate.partyName}</p>
                                </div>
                            </div>

                            <p style={{"marginTop":"1.5rem","textAlign":"center","color":"#4B5563"}}>
                                Are you sure you want to cast your vote for this candidate? This action cannot be undone.
                            </p>
                        </div>
                        <p>{error}</p>
                        {/* Action Buttons */}
                        <div style={{"display":"flex","width":"100%","justifyContent":"space-between","paddingTop":"1rem","paddingBottom":"1rem","paddingLeft":"1.5rem","paddingRight":"1.5rem", "marginLeft": "0.75rem","backgroundColor":"#F9FAFB"}}>  
                            {/* "marginLeft":["0.75rem","0.875rem"] */}
                            <button
                                onClick={() =>{ setShowConfirmation(false),setSelectedCandidate(null)}}
                                style={{"width":"30%", "display":"flex","paddingTop":"0.5rem","paddingBottom":"0.5rem","paddingLeft":"1rem","paddingRight":"1rem","marginLeft":"0.5rem","alignItems":"center","borderRadius":"0.5rem","color":"#4B5563","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"300ms","border":"0","outline":"0","cursor":"pointer"}}
                                className="action-button"
                            >
                                <X size={20} />
                                <span>Cancel</span>
                            </button>
                            <button
                                onClick={handleConfirmVote}
                               style={{"display":"flex","paddingTop":"0.5rem","paddingBottom":"0.5rem","paddingLeft":"1rem","paddingRight":"1rem","marginLeft":"0.5rem","alignItems":"center","borderRadius":"0.5rem","color":"#ffffff"}}
                                className="confirm-voteButton"
                            >
                                <Check size={20} />
                                {loading?<span>Please wait..</span>:<span>Confirm Vote</span>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Candidate({id, name, partyName, showVoteButtons,selectedCandidate, onVoteClick,hasVoted }: CandidateData & { onVoteClick: () => void } & {selectedCandidate:any} & {hasVoted:any}) {
    const selectedCandidateId=Number(localStorage.getItem("selectedCandidate"));
    console.log("Id is",id);
    console.log("Selected Id is",selectedCandidateId);
    return selectedCandidateId!==id?(
        <div className="CandidateCard-container">
            <div className="CandidateCard">
                <div className="image-container"><img src="Flag.png" alt="Flag" /></div>
                <div className="details-container">
                    <label htmlFor="name">Name:</label>
                    <input type="text" value={name} readOnly id="name" />
                    <label htmlFor="Partyname">Party Name:</label>
                    <input type="text" value={partyName} readOnly id="Partyname" />
                </div>
            </div>
            {showVoteButtons && !hasVoted && (
                <button className="vote-button"onClick={onVoteClick}>Vote</button>
            )}
        </div>
    ):
    <div className="CandidateCard-container">
            <div className="CandidateCard"  style={{"backgroundColor":"green"}}>
                <div className="image-container"><img src="Flag.png" alt="Flag" /></div>
                <div className="details-container"  >
                    <label htmlFor="name">Name:</label>
                    <input type="text" value={name} readOnly id="name" />
                    <label htmlFor="Partyname">Party Name:</label>
                    <input type="text" value={partyName} readOnly id="Partyname" />
                </div>
            </div>
    </div>
}