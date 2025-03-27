import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from 'recoil';
import axios from "axios"
import { candidateAtom } from '../Atoms/CandidatesAtom'
import '../styles/ViewCandidate.css'
interface CandidateData {
    id: number
    name: string
    partyName: string
    showVoteButtons: boolean
}
export default function CandidatesList({ showVoteButtons,candidatesRef }: any) {
    const [candidates, setCandidates] = useRecoilState(candidateAtom);
    // const [showVoteButtons, setShowVoteButtons] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const getCandidates = useCallback(async function () {
        try {
            setLoading(true)
            setError("")
            const data = await axios.post("http://localhost:5000/voter/getCandidates");
            console.log("Candidates obtained", data);
            if (data.status === 200)
                setCandidates(data.data.candidates);
        } catch (error: any) {
            console.log(error.message);
            if (error.response) {
                if (error.response.status === 400) {

                    console.log(error.response.data.message)
                }
                else if (error.response.status === 500) {
                    console.log("Internal Server error")
                }
            }
            else {
                console.log(error.response?.data?.message || error.message || "Invalid format")

            }
            setError(error.response?.data?.message || error.message || "Invalid format");
        }finally{
            setLoading(false);
        }
    }, [])
    useEffect(() => {
        getCandidates()
    }, [getCandidates])

    // const candidates = [
    //     { id: 1, name: 'hhs', partyName: 'hbhbsdb' },
    //     { id: 2, name: 'hhs', partyName: 'hbhbsdb' },
    //     { id: 3, name: 'hhs', partyName: 'hbhbsdb' },
    //     { id: 4, name: 'hhs', partyName: 'hbhbsdb' },
    //     { id: 4, name: 'hhs', partyName: 'hbhbsdb' },
    //     { id: 4, name: 'hhs', partyName: 'hbhbsdb' },
    //     { id: 4, name: 'hhs', partyName: 'hbhbsdb' },
    //     { id: 4, name: 'hhs', partyName: 'hbhbsdb' },
    //     { id: 4, name: 'hhs', partyName: 'hbhbsdb' },
    //     { id: 4, name: 'hhs', partyName: 'hbhbsdb' },
    //     { id: 4, name: 'hhs', partyName: 'hbhbsdb' },
    // ]

    return (

        <div ref={candidatesRef} className="CandidateContainer">
            <h1>Candidates List</h1>
            {loading ? (
                <h2>Loading...</h2>
            )  : candidates.length !== 0 ? (
                <div className="CandidateListContainer">
                    {candidates.map(candidate => (
                        <Candidate key={candidate.id} id={candidate.id} name={candidate.name} partyName={candidate.partyName} showVoteButtons={showVoteButtons} />
                    ))}
                </div>
            ) : (
                <h2>No Candidates Found</h2>
            )}
        </div>)

}
function Candidate({ name, partyName, showVoteButtons }: CandidateData) {
    return <div className="CandidateCard-container">
        <div className="CandidateCard">
            <div className="image-container"><img src="Flag.png" alt="Flag" /></div>
            <div className="details-container">
                <label htmlFor="name">Name:</label>
                <input type="text" value={name} readOnly id="name" />
                <label htmlFor="Partyname">Party Name:</label>
                <input type="text" value={partyName} readOnly id="Partyname" />
            </div>
        </div>
            {showVoteButtons && (
                <button className="vote-button">Vote</button>
            )}
    </div>
}