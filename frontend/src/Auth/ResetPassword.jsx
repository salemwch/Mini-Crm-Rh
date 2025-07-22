import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { resetPassword } from "../service/auth";
import  '../Auth/auth.css';
const ResetPassword = () =>{
    const {token} = useParams();
    const navigate = useNavigate();
    
    
    const [password, setPassword] = useState("");
    const [confirm , setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");



    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError("");
        setSuccess("");

        if(password !==confirm) {
            setError("password does not match");
            return;
        }
        try{
            await resetPassword(token, password);
            setSuccess("password reset successfully");
            setTimeout(() => navigate("/login"), 2000);
        }catch(err){
            setError(err.message || "reset password failed");
        }
    };



    return(
        <div className="reset-container">

            <div className="reset-card">
                <h2>Reset Your Password </h2>
                <p className="reset-subtext"> Please enter your New Password </p>

                <form onSubmit={handleSubmit} className="reset-form"> 
                    <input type="password" 
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="reset-input"/> 

                    <input type="password"
                    placeholder="confirm password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="reset-input"/>
                    {error && <p className="reset-error"> {error} </p>}
                    {success && <p className="reset-success">{success}</p> }
                    <button type="submit" className="reset-btn"> Reset Password </button> 
                </form>
            </div>
        </div> 



    )
}


export default ResetPassword;