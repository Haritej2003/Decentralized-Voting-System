// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import axios from "axios";
// import { useState } from "react";
// import '../styles/VoterSignup.css' 
// // Define TypeScript interface for form data
// interface LoginFormData {
//     email: string;
//     password: string;
//     role:"voter"| "admin";
// }

// // Validation schema using Yup
// const schema = yup.object().shape({
//     email: yup.string().email("Invalid email").required("Email is required"),
//     password: yup.string().required("Password is required")
//         .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.")
//         .min(8, "Password must be at least 6 characters"),
//     role: yup.string().oneOf(["voter", "admin"]).required("Role is required"),
// });

// const LoginForm=({isAdmin}:{isAdmin:boolean}) => {
//     const {
//         register ,
//         handleSubmit,
//         formState: { errors }
//     } = useForm<LoginFormData>({
//         resolver: yupResolver(schema),
//     });

//     const [loading, setLoading] = useState<boolean>(false);
//     const [message, setMessage] = useState("");
    
//     const onSubmit = async (data: LoginFormData) => {
//         setLoading(true);
//         setMessage("");
//         try {
//             console.log("sending...")
//             const access=(data.role==="voter")?"voter":"admin";
//             const response = await axios.post(
//                 `http://localhost:5000/${access}/login`,
//                 {email:data.email,password:data.password,role:data.role}
//             );
//             console.log("sent",response);
//             localStorage.setItem("Authorization",`Bearer ${response.data.token}`)
//             setMessage("Login Successfull");
//         } catch (error: any) {
//                 if(error.response){
//                     if(error.response.status === 401){
//                         setMessage(error.response.data.message)
//                     }
//                     else if(error.response.status === 404){
//                         setMessage("Invalid Data format")
//                     }
//                     else if(error.responsestatus===500){
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
//                 <h2 >Login</h2>
//                 <form onSubmit={handleSubmit(onSubmit)}>
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
//                         {loading ? "Loging in..." : "Login"}
//                     </button>

//                     {message && <p>{message}</p>}
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default LoginForm;
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { Vote, AlertCircle, Info } from 'lucide-react';
import '../styles/LoginForm.css';

// Define TypeScript interface for form data
interface LoginFormData {
    email: string;
    password: string;
    role: "voter" | "admin";
}

// Validation schema using Yup
const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.")
        .min(8, "Password must be at least 6 characters"),
    role: yup.string().oneOf(["voter", "admin"]).required("Role is required"),
});

const LoginForm = ({ isAdmin }: { isAdmin: boolean }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: yupResolver(schema),
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState("");
    const navigate=useNavigate();
    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setMessage("");
        try {
            console.log("sending...")
            const access = (data.role === "voter") ? "voter" : "admin";
            const response = await axios.post(
                `http://localhost:5000/${access}/login`,
                { email: data.email, password: data.password, role: data.role }
            );
            console.log("sent", response);
            localStorage.setItem("Authorization", `Bearer ${response.data.token}`)
            localStorage.setItem("VoterId",response.data.voter.id);
            localStorage.setItem("Role",access);
            setMessage("Login Successful");
            setTimeout(() => {
                navigate("/");
            }, 800);
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 401) {
                    setMessage(error.response.data.message)
                }
                else if (error.response.status === 404) {
                    setMessage("Invalid Data format")
                }
                else if (error.response.status === 500) {
                    setMessage("Internal Server error")
                }
            } else {
                setMessage(error.response?.data?.message || error.message || "Login failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-form-container">
                    <div className="login-header">
                        <Vote className="login-logo" size={32} />
                        <h2>Welcome Back</h2>
                        <p>Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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
                                placeholder="Enter your password"
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

                        {isAdmin && (
                            <div className="form-group">
                                <label>Login As</label>
                                <select {...register("role")} className="role-select">
                                    <option value="voter">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        )}
                        {!isAdmin && <input type="hidden" {...register("role")} value="voter" />}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                        {message && (
                            <div className={`message ${message.includes("Successful") ? "success" : "error"}`}>
                                {message.includes("Successful") ? "✓" : "!"} {message}
                            </div>
                        )}

                        <p className="signup-link">
                            Don't have an account? <Link to="/signup">Sign up</Link>
                        </p>
                    </form>
                </div>

                <div className="login-info">
                    <div className="info-section">
                        <h3><Info size={20} /> Election Guidelines</h3>
                        <ul>
                            <li>Verify your identity with valid government ID</li>
                            <li>Ensure your registration details are up to date</li>
                            <li>Vote only once in each election</li>
                            <li>Keep your login credentials secure</li>
                        </ul>
                    </div>

                    <div className="info-section">
                        <h3>Important Dates</h3>
                        <ul>
                            <li>Registration Deadline: March 15, 2025</li>
                            <li>Voting Period: March 20-25, 2025</li>
                            <li>Results Declaration: March 26, 2025</li>
                        </ul>
                    </div>

                    <div className="info-section">
                        <h3>Need Help?</h3>
                        <p>Contact our support team:</p>
                        <p>Email: 21r11a66b5@gcet.edu.in</p>
                        {/* <p>Phone: </p> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;