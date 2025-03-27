// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import axios from "axios";
// import { useState } from "react";
// import '../styles/VoterSignup.css'
// // Define TypeScript interface for form data
// interface SignupFormData {
//     name: string;
//     email: string;
//     password: string;
//     confirmPassword: string;
//     role:"voter"| "admin";
// }

// // Validation schema using Yup
// const schema = yup.object().shape({
//     name: yup.string().required("Name is required").matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
//     email: yup.string().email("Invalid email").required("Email is required"),
//     password: yup.string().required("Password is required")
//         .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.")
//         .min(8, "Password must be at least 6 characters"),
//     confirmPassword: yup
//         .string()
//         .oneOf([yup.ref("password")], "Passwords must match")
//         .required("Confirm password is required"),
//     role: yup.string().oneOf(["voter", "admin"]).required("Role is required"),
// });

// const SignupForm=({isAdmin}:{isAdmin:boolean}) => {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors }
//     } = useForm<SignupFormData>({
//         resolver: yupResolver(schema),
//     });

//     const [loading, setLoading] = useState<boolean>(false);
//     const [message, setMessage] = useState("");
    
//     const onSubmit = async (data: SignupFormData) => {
//         setLoading(true);
//         setMessage("");
//         try {
//             console.log("sending...")
//             const access=(data.role==="voter")?"voter":"admin";
//             const response = await axios.post(
//                 `http://localhost:5000/${access}/register`,
//                 {name:data.name,email:data.email,password:data.password,role:data.role}
//             );
//             console.log("sent",response);
//             localStorage.setItem("Authorization",`Bearer ${response.data.token}`)
//             setMessage("Signup Successfull");
//         } catch (error: any) {
//                 if(error.response){
//                     if(error.response.status === 409){
//                         setMessage("Account already exists. Please Login")
//                     }
//                     else if(error.response.status === 422){
//                         setMessage("Invalid Data format")
//                     }
//                     else if(error.response.status===500){
//                         setMessage("Internal Server error")
//                     }
//                 }else{

//                     setMessage(error.response?.data?.message || error.message || "Signup failed");
//                 }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="VoterSignup">
//             <div className="container ">
//                 <h2 >Signup</h2>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <div>
//                         <label >Name</label>
//                         <input {...register("name")} />
//                         {errors.name && <p >{errors.name.message}</p>}
//                     </div>

//                     <div>
//                         <label >Email</label>
//                         <input {...register("email")} />
//                         {errors.email && <p>{errors.email.message}</p>}
//                     </div>

//                     <div>
//                         <label >Password</label>
//                         <input type="password" {...register("password")} />
//                         {errors.password && <p className="">{errors.password.message}</p>}
//                     </div>

//                     <div>
//                         <label >Confirm Password</label>
//                         <input type="password" {...register("confirmPassword")}/>
//                         {errors.confirmPassword && <p >{errors.confirmPassword.message}</p>}
//                     </div>
//                     {isAdmin ? (
//                         <div className="dropdown-container">
//                             <label>Role</label>
//                             <select {...register("role")}>
//                                 <option value="voter" >User</option>
//                                 <option value="admin">Admin</option>
//                             </select>
//                         </div>
//                     ) : (
//                         // If not an admin, role is always "user"
//                         <input type="hidden" {...register("role")} value="user" />
//                     )}
//                     <button
//                         type="submit"
//                         disabled={loading}
//                     >
//                         {loading ? "Signing up..." : "Signup"}
//                     </button>

//                     {message && <p>{message}</p>}
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default SignupForm;


import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Vote, AlertCircle, Shield, Lock, Key, FileCheck } from 'lucide-react';
import '../styles/VoterSignup.css';

interface SignupFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "voter" | "admin";
}

const schema = yup.object().shape({
    name: yup.string().required("Name is required").matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.")
        .min(8, "Password must be at least 6 characters"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    role: yup.string().oneOf(["voter", "admin"]).required("Role is required"),
});

const SignupForm = ({ isAdmin }: { isAdmin: boolean }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignupFormData>({
        resolver: yupResolver(schema),
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState("");
    const navigate=useNavigate();
    const onSubmit = async (data: SignupFormData) => {
        setLoading(true);
        setMessage("");
        try {
            console.log("sending...")
            const access = (data.role === "voter") ? "voter" : "admin";
            const response = await axios.post(
                `http://localhost:5000/${access}/register`,
                { name: data.name, email: data.email, password: data.password, role: data.role }
            );
            console.log("sent", response);
            localStorage.setItem("Authorization", `Bearer ${response.data.token}`)
            localStorage.setItem("VoterId",response.data.voter.id);
            localStorage.setItem("Role",access);
            setMessage("Signup Successful");
            setTimeout(() => {
                navigate("/");
            }, 800);
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 409) {
                    setMessage("Account already exists. Please Login")
                }
                else if (error.response.status === 422) {
                    setMessage("Invalid Data format")
                }
                else if (error.response.status === 500) {
                    setMessage("Internal Server error")
                }
            } else {
                setMessage(error.response?.data?.message || error.message || "Signup failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <div className="signup-form-container">
                    <div className="signup-header">
                        <Vote className="signup-logo" size={32} />
                        <h2>Create Your Account</h2>
                        <p>Join the future of secure digital voting</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className={errors.name ? 'error' : ''}
                                {...register("name")}
                            />
                            {errors.name && (
                                <span className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.name.message}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={errors.email ? 'error' : ''}
                                {...register("email")}
                            />
                            {errors.email && (
                                <span className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.email.message}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Create a strong password"
                                className={errors.password ? 'error' : ''}
                                {...register("password")}
                            />
                            {errors.password && (
                                <span className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                className={errors.confirmPassword ? 'error' : ''}
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <span className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>

                        {isAdmin && (
                            <div className="form-group">
                                <label>Register As</label>
                                <select {...register("role")} className="role-select">
                                    <option value="voter">Voter</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        )}
                        {!isAdmin && <input type="hidden" {...register("role")} value="voter" />}

                        <button
                            type="submit"
                            className="signup-button"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                        {message && (
                            <div className={`message ${message.includes("Successful") ? "success" : "error"}`}>
                                {message.includes("Successful") ? "✓" : "!"} {message}
                            </div>
                        )}

                        <p className="login-link">
                            Already have an account?<Link to="/login">Sign in</Link> 
                            
                        </p>
                    </form>
                </div>

                <div className="signup-info">
                    <div className="info-section">
                        <h3><Shield size={20} /> Blockchain Security</h3>
                        <ul>
                            <li>Immutable vote records on the blockchain</li>
                            <li>End-to-end encryption for vote privacy</li>
                            <li>Transparent and auditable voting process</li>
                            <li>Protection against double-voting</li>
                        </ul>
                    </div>

                    {/* <div className="info-section">
                        <h3><Lock size={20} /> Identity Verification</h3>
                        <ul>
                            <li>Government ID verification required</li>
                            <li>Biometric authentication support</li>
                            <li>Unique cryptographic voter ID</li>
                            <li>Anti-fraud measures</li>
                        </ul>
                    </div> */}

                    <div className="info-section">
                        <h3><Key size={20} /> Your Digital Voting Rights</h3>
                        <ul>
                            <li>Vote securely from anywhere</li>
                            <li>Verify your vote was counted</li>
                            <li>Access real-time election results</li>
                            <li>Participate in multiple elections</li>
                        </ul>
                    </div>

                    <div className="info-section">
                        <h3><FileCheck size={20} /> Next Steps</h3>
                        <ol>
                            <li>Complete identity verification</li>
                            <li>Set up two-factor authentication</li>
                            <li>Review upcoming elections</li>
                            <li>Cast your secure vote</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
