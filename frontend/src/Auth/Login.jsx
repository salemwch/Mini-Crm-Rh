import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginImage from "../assets/undraw_file_sync_ot38.svg";
import { AuthContext } from '../components/AuthProvider';

import '../Auth/auth.css'
const Login = () => {
const [data, setData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const loggedInUser = await login(data);
      if (loggedInUser.role === 'admin') {
        navigate('/Admin-Dashboard');
      } else if (loggedInUser.role === 'rh') {
        navigate('/Rh-Dashboard');
      } else {
        navigate('/unauthorized');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed.');
    }
  };




  
  
  

  return (
   
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-6 order-md-2">
              <img src={LoginImage} alt="Login visual" className="img-fluid" />
            </div>

            <div className="col-md-6 contents">
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <div className="mb-4">
                    <h3>
                      Sign In to <strong>Mini CRM</strong>
                    </h3>
                    <p className="mb-4">
                      Welcome back! Please login to your account.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="form-group first">
                      <label htmlFor="email"></label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="form-group last mb-4">
                      <label htmlFor="password"></label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Your secure password"
                      />
                    </div>

                    {error && (
                      <p className="text-danger small mb-3">{error}</p>
                    )}

                    <div className="d-flex mb-5 align-items-center">
                      <label className="control control--checkbox mb-0">
                        <span className="caption">Remember me</span>
                        <input type="checkbox" defaultChecked />
                        <div className="control__indicator"></div>
                      </label>
                      <span className="ml-auto">
                        <a
                          href="/auth/forgetpassword"
                          className="forget-password"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/auth/forget-password");
                          }}
                        >
                          Forget Password?
                        </a>
                      </span>
                    </div>

                    <input
                      type="submit"
                      value="Log In"
                      className="btn text-white btn-block btn-primary"
                    />
                    <input
                      type="submit"
                      value="Create Account"
                      className="btn text-white btn-block btn-primary"
                      onClick={(e) =>{
                        e.preventDefault()
                        navigate("/register")
                      }}
                    />
                    <span className="d-block text-left my-4 text-muted">
                      or sign in with
                    </span>

                    <div className="social-login">
                      <a href="/login" className="facebook">
                        <span className="icon-facebook mr-3"></span>
                      </a>
                      <a href="/login" className="twitter">
                        <span className="icon-twitter mr-3"></span>
                      </a>
                      <a href="/login" className="google">
                        <span className="icon-google mr-3"></span>
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
  );
};

export default Login;
