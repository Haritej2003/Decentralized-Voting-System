
import { useCallback, useEffect } from "react"
import axios from "axios"
import {useRecoilState} from 'recoil';
import { candidateAtom } from '../Atoms/CandidatesAtom';
import '../styles/GetCandidate.css'
interface CandidateData {
    id: number
    name: string
    partyName: string
}
export default function CandidateList() {
    const [candidates, setCandidates] = useRecoilState(candidateAtom);
    const getCandidates = useCallback(async function () {
        try {

            const data = await axios.post("http://localhost:5000/admin/getCandidates");
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
        }
    }, [])
    useEffect(() => {
        getCandidates()
    }, [getCandidates])
    return (
        <div className="GetCandidature">
            <h3>Candidates List</h3>
            <div className="table-container">
            <table>
                <thead>
                    <tr>

                        <th>ID</th>
                        <th>Name</th>
                        <th>Party Name</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.length !== 0 ? (
                        <>
                            {candidates.map(candidate => (
                                <Table key={candidate.id} id={candidate.id} name={candidate.name} partyName={candidate.partyName} />
                            ))}
                        </>
                    ) : (

                        <tr>
                            <td colSpan={3} style={{ textAlign: "center", fontWeight: "bold" }}>
                                No Candidates found
                            </td>
                        </tr>

                    )}
                </tbody>
            </table>
        </div>
         </div >
    ) 
}
function Table({ id, name, partyName }: CandidateData) {
    return (
        <tr>
            <td>{id}</td>
            <td>{name}</td>
            <td>{partyName}</td>
        </tr>
   )
}