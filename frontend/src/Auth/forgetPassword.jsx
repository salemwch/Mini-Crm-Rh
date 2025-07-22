import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../service/auth";
import  '../Auth/auth.css';

const ForgetPassword = () =>{
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();




    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setError("");
        try{
            const res = await forgetPassword(email);
            setMsg(res.message || "password reset Link Sent");
        }catch(error){
            setError(error.response?.data?.message || "Failed to reset password please try again later or Contact support");
        }
    };

    return(
      <div>
            <form onSubmit={handleSubmit} className="forget-form">
  <h2 className="forget-title"> Forgot Your Password?</h2>

  <input
    type="email"
    name="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="forget-input"
  />

  {msg && <p className="forget-success">{msg}</p>}
  {error && <p className="forget-error">{error}</p>}

  <button type="submit" className="forget-btn">
    Send Reset Link
  </button>

  <div className="forget-footer">
    <button
      type="button"
      onClick={() => navigate("/login")}
      className="forget-link"
    >
      ⬅ Back to Login
    </button>
  </div>
</form>
</div>
    );
};

export default ForgetPassword;