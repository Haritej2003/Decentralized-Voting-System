
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from 'axios'
import '../styles/AddCandidate.css'
interface CandidateData {
    id:number;
    name: string;
    partyName:string;
}
interface DeleteCandidateProps {
    candidates: CandidateData[];
    setCandidates: React.Dispatch<React.SetStateAction<CandidateData[]>>;
    setshowDeleteCandidate: React.Dispatch<React.SetStateAction<boolean>>;
}
interface FormData{
    id:number
}
export default function DeleteCandidate({candidates,setCandidates,setshowDeleteCandidate}:DeleteCandidateProps){
const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>();
    const [loading, setLoading] = useState<boolean>(false);
        const [message, setMessage] = useState("");

        const onSubmit = async (data:FormData) => {
            setLoading(true);
            setMessage("");
            const find=candidates.filter((candidate)=>candidate.id===Number(data.id));

            console.log("form data is",data);
            
            try{
                if(find.length===0){
                    setMessage("No Candidate Found");
                    return;
                }
                const response=await axios.post("http://localhost:5000/admin/deleteCandidate",{
                id:Number(data.id)
                });
                console.log(response);
                if(response.status === 200){
                    const result:CandidateData[]=candidates.filter((candidate)=>candidate.id !=data.id);
                    setCandidates(result);
                    alert("Candidate Deleted Successfully");
                    setshowDeleteCandidate(false);
                }
            }
            catch(error:any){
                console.log(error.message);
                if(error.response){
                    if(error.response.status === 400){                        
                        setMessage(error.response.data.message)
                    }
                    else if(error.response.status===500){
                        setMessage("Internal Server error")
                    }
                }
                else{
                    console.log(error.response?.data?.message || error.message || "Invalid format")
                    setMessage(error.response?.data?.message || error.message || "Invalid format")
                }
            }finally{
                setLoading(false);
            }
        }

    return (
        <div className="add-candidate-container">
            <div className="form-wrapper">
                <h2>Delete Candidate</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    
                    <div  className="form-group">
                        <label >Enter Candidate ID</label>
                        <input {...register("id")} className="form-input"  />
                        {errors.id && <p >{errors.id.message}</p>}
                    </div>
                    <button
                            type="submit"
                            disabled={loading}
                            className={`submit-button ${loading ? "disabled" : ""}`}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </button>
                    
                        {message && <p className="success-message" >{message}</p>}
                </form>
            </div>
            </div>
    )
}
