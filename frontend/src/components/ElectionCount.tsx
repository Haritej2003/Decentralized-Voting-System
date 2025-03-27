import { useEffect, useState, memo, useCallback } from 'react'
import axios from 'axios'
import { useFormik } from "formik"
import * as Yup from "yup";
import { NewElection } from '../Atoms/CandidatesAtom';
import { useElectionProgress } from '../Atoms/contextAPI'
import { useRecoilState } from 'recoil';
import { Check, X } from 'lucide-react';
import '../styles/ElectionCount.css'
interface Data {
    Completed: number,
    Ongoing: number,
    Upcomming: number,
}
const ElectionCount = memo(function ElectionCount() {
    const [electionData, setelectionData] = useState<Data>({
        Completed: 0,
        Ongoing: 0,
        Upcomming: 0,
    })
    const { electionProgress } = useElectionProgress();

    const { updateElectionProgress } = useElectionProgress();
    const [viewModal, setViewModal] = useState(false);
    const getElectionDetails = useCallback(async () => {
        try {

            const data: any = await axios.post("http://localhost:5000/admin/getElectionDetails");
            console.log(data);
            const finalData={
                Completed: data.data.Completed? data.data.Completed:0,
                Upcomming: data.data.Upcomming? data.data.Upcomming:0,
                Ongoing: data.data.Ongoing? data.data.Ongoing:0,
            }
            setelectionData(finalData);
        }
        catch (error) {
            console.error("Error fetching election details: ", error);
        }
    }, [])
    useEffect(() => {
        console.log("fetching...");
        getElectionDetails();

    }, [getElectionDetails,electionProgress]);
    return (
        <div className="ElectionCount">
            <h3>Election Details</h3>
            <table>
                <tbody>
                    <tr>
                        <th>Elections Completed</th>
                        <td>{electionData.Completed}</td>
                    </tr>
                    <tr>
                        <th>Elections Ongoing</th>
                        <td>{electionData.Ongoing}</td>
                    </tr>
                    <tr>
                        <th>Elections Upcomming</th>
                        <td>{electionData.Upcomming}</td>
                    </tr>
                </tbody>
            </table>
            {!electionProgress ? (<button className='conduct-button' onClick={() => setViewModal(true)}>Conduct Election</button>) :
                <button className='conduct-button' onClick={() => setViewModal(true)}>End Election</button>
            }
            {viewModal && <ElectionModal electionProgress={electionProgress} updateElectionProgress={updateElectionProgress} onClose={() => setViewModal(false)} />}

        </div>
    )
});


const ElectionModal = ({ onClose, updateElectionProgress, electionProgress }: { onClose: () => void; updateElectionProgress: (value: boolean) => void; electionProgress: boolean }) => {
    const [electionData, setElectionData] = useRecoilState(NewElection);
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    today.setHours(0,0,0,0);
    const validationSchema = Yup.object({
        name: Yup.string()
            .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces allowed")
            .required("Election name is required"),
        startDate: Yup.date()
            .typeError("Invalid date format")
            .min(new Date(today), "Start date must be in the future")
            .required("Start date is required"),
        endDate: Yup.date()
            .min(Yup.ref("startDate"), "End date must be after start date")
            .required("End date is required"),
        startTime: Yup.string()
            .test("is-valid-time", "Start time must be in the future", function (value) {
                const selectedDate = this.parent.startDate;
                const todayDate = new Date() // Current date in YYYY-MM-DD
                const currentTime = new Date().toTimeString().split(" ")[0].slice(0, 5); // Current time HH:MM

                // If startDate is today, validate time. Otherwise, no need.
                if (selectedDate instanceof Date && selectedDate.getTime() === todayDate.getTime()) {
                    return value >= currentTime;
                }
                return true;
            })
            .required("Start time is required"),
        endTime: Yup.string()
            .test("is-one-hour-after", "End time must be at least 1 hour after start time", function (value) {
                const startTime = this.parent.startTime;
                if (!startTime || !value) return false;
                const [startHour, startMinute] = startTime.split(":").map(Number);
                const [endHour, endMinute] = value.split(":").map(Number);
                return endHour > startHour || (endHour === startHour && endMinute >= startMinute + 60);
            })
            .required("End time is required"),
    });
    console.log("In modal", electionData);
    const formik = useFormik({
        initialValues: {
            name: electionData.name,
            startDate: electionData.startDate.toISOString().split("T")[0],
            endDate: electionData.endDate.toISOString().split("T")[0],
            startTime: electionData.startTime,
            endTime: electionData.endTime,
        },
        validationSchema, 
        onSubmit: async (values) => {
            console.log("called", values)

            try {
                const res = await axios.post("http://localhost:5000/admin/createElection", values);
                console.log("Response received", res.data.elections);
                const formattedStartDate = new Date(`${values.startDate}T00:00:00Z`);
                const formattedEndDate = new Date(`${values.endDate}T00:00:00Z`);
                values.startDate = formattedStartDate.toISOString().split("T")[0];;
                values.endDate = formattedEndDate.toISOString().split("T")[0];;
                const updatedValues = {
                    ...values,
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    status: "Ongoing"
                };
                setElectionData(updatedValues);
                console.log("Updated data is", electionData);
                updateElectionProgress(true)
                localStorage.setItem("electionId",res.data.election.id);
                console.log("saved ID to localstorage",res.data.id)
                onClose();
            } catch (error: any) {
                console.log(error.response?.message || "An error occurred");
            }
        },
    });

    {
        return electionProgress ?
            <EndElection onClose={onClose} updateElectionProgress={updateElectionProgress} /> :
            <div className="modal-election">
                <div className="modal-content">
                    <h2 className="modal-title">Create New Election</h2>

                    <form onSubmit={formik.handleSubmit}>
                        <div className="modal-field">
                            <label>Election Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter election name"
                            />
                            {formik.touched.name && formik.errors.name && <p className="error">{formik.errors.name}</p>}
                        </div>

                        <div className="modal-field">
                            <label>Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formik.values.startDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.startDate && formik.errors.startDate && (
                                <p className="error">{formik.errors.startDate}</p>
                            )}
                        </div>

                        <div className="modal-field">
                            <label>End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formik.values.endDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.endDate && formik.errors.endDate && (
                                <p className="error">{formik.errors.endDate}</p>
                            )}
                        </div>

                        <div className="modal-field">
                            <label>Start Time</label>
                            <input
                                type="time"
                                name="startTime"
                                value={formik.values.startTime}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.startTime && formik.errors.startTime && (
                                <p className="error">{formik.errors.startTime}</p>
                            )}
                        </div>

                        <div className="modal-field">
                            <label>End Time</label>
                            <input
                                type="time"
                                name="endTime"
                                value={formik.values.endTime}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.endTime && formik.errors.endTime && (
                                <p className="error">{formik.errors.endTime}</p>
                            )}
                        </div>

                        <div className="modal-buttons">
                            <button className="close-btn" type="button" onClick={onClose}>x</button>
                            <button className="confirm-btn" type="submit">Confirm</button>
                        </div>
                    </form>
                </div>
            </div>
    };
}


function EndElection({ onClose, updateElectionProgress }: { onClose: () => void; updateElectionProgress: (value: boolean) => void }) {
    async function handleConfirmEnd() {
        try{
            console.log("ending election");
        const id=localStorage.getItem("electionId");
        await axios.post("http://localhost:5000/admin/endElection",{id});        
        updateElectionProgress(false);
        localStorage.removeItem("electionId");
        localStorage.setItem("electionProgress",false);
        alert("Election ended");
        onClose();
        }catch(error:any){
            console.log(error.response?.message || "An error occurred");
        }
    }

    return (
        <div className="modal-Endcontainer">
            <div className="modal">
                {/* Modal Header */}
                <div className="modal-header">
                    <h3 >Confirm to End Election</h3>
                </div>
                <div style={{ "display": "flex", "paddingTop": "1rem", "paddingBottom": "1rem", "paddingLeft": "1.5rem", "paddingRight": "1.5rem", "marginLeft": "0.75rem", "justifyContent": "flex-end", "backgroundColor": "#F9FAFB" }}>
                    {/* "marginLeft":["0.75rem","0.875rem"] */}
                    <button
                        onClick={() => onClose()}
                        style={{ "width": "30%", "display": "flex", "paddingTop": "0.5rem", "paddingBottom": "0.5rem", "paddingLeft": "1rem", "paddingRight": "1rem", "marginLeft": "0.5rem", "alignItems": "center", "borderRadius": "0.5rem", "color": "#4B5563", "transitionProperty": "color, background-color, border-color, text-decoration-color, fill, stroke", "transitionTimingFunction": "cubic-bezier(0.4, 0, 0.2, 1)", "transitionDuration": "300ms", "border": "0", "outline": "0", "cursor": "pointer" }}
                        className="action-button"
                    >
                        <X size={20} />
                        <span>Cancel</span>
                    </button>
                    <button
                        onClick={handleConfirmEnd}
                        style={{ "display": "flex", "paddingTop": "0.5rem", "paddingBottom": "0.5rem", "paddingLeft": "1rem", "paddingRight": "1rem", "marginLeft": "0.5rem", "alignItems": "center", "borderRadius": "0.5rem", "color": "#ffffff" }}
                        className="confirm-endButton"
                    >
                        <Check size={20} />
                        <span>Confirm</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default ElectionCount;