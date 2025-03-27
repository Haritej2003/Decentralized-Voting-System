import { useCallback, useEffect, useState } from 'react';
import AddCandidate from './AddCandidate';
import DeleteCandidate from './DeleteCandidate'
import axios from 'axios'
import {useRecoilState} from 'recoil';
import { candidateAtom } from '../Atoms/CandidatesAtom';
import {useElectionProgress} from '../Atoms/contextAPI'
import '../styles/Candidate.css'


export default function Candidature() {
    const [candidates, setCandidates] = useRecoilState(candidateAtom);
    const [showAddCandidate, setshowAddCandidate] = useState(false);
    const [showDeleteCandidate, setshowDeleteCandidate] = useState(false);
    const { electionProgress } = useElectionProgress();
    const getCandidates = useCallback(async () => {
        const data = await axios.post("http://localhost:5000/admin/getCandidates");
        console.log(data);
        setCandidates(data.data.candidates);
    }, [])
    useEffect(() => {
        getCandidates();
    }, [getCandidates])
   
    async function handleAddCandidate() {
        console.log("set to true");
        setshowAddCandidate(true)
    }
    async function handleDeleteCandidate() {
        setshowDeleteCandidate(true)
    }
    
    // {showDeleteCandidate && <DeleteCandidate/>}
    console.log(showAddCandidate);
    return (
        <div className="Candidature">
            <h3>Candidate Management</h3>
            <table>
                <tbody>
                    <tr>
                        <th>Number of Candidates</th>
                        <td>{candidates !== null ? candidates.length : 0}</td>
                    </tr>
                    <tr>
                        <td><button className="addCandidate"   disabled={electionProgress} style={{ backgroundColor: electionProgress ? "gray" : "" }} onClick={handleAddCandidate}>Add Candidate</button> </td>
                        <td><button className="deleteCandidate"  disabled={electionProgress} style={{ backgroundColor: electionProgress ? "gray" : "" }}  onClick={handleDeleteCandidate} >Delete Candidate</button> </td>
                    </tr>
                </tbody>
            </table>
            {showAddCandidate && (
                <div className="modal">
                <div className="modal-content">
                    <span className="close-btn" onClick={() => setshowAddCandidate(false)}>×</span>
                    <AddCandidate candidates={candidates} setCandidates={setCandidates} setshowAddCandidate={setshowAddCandidate} />
                </div>
            </div>
            )}
            {showDeleteCandidate && (
                <div className="modal">
                <div className="modal-content">
                    <span className="close-btn" onClick={() => setshowDeleteCandidate(false)}>×</span>
                    <DeleteCandidate candidates={candidates} setCandidates={setCandidates} setshowDeleteCandidate={setshowDeleteCandidate} />
                </div>
            </div>
            )}

        </div>
    )

}