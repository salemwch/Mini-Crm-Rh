import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminExist } from "../service/user";
import { createUser } from "../service/user";
import RegisterAnimation from "../assets/animation/Login.json";
import Lottie from "lottie-react";
import rhAnime from "../assets/animation/rhAnime.json";
import adminAnime from "../assets/animation/adminAnime.json";
import "../Auth/auth.css";
const CreateUser = () => {
const navigate = useNavigate();
const [Loading, setLoading] = useState(false);
const [successMessage, setSuccessMessage] = useState("");
const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  role: "rh",
});
const [imageFile, setImageFile] = useState(null);
const [adminExisting, setAdminExisting] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
  const checkAdminExist = async () => {
    try {
      const res = await adminExist(); 
      setAdminExisting(res.adminExist);

      setFormData((prev) => ({
        ...prev,
        role: res.adminExist ? "rh" : "admin",
      }));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to check admin existence");
    }
  };
  checkAdminExist();
}, []);

const handleChange = (e) => {
  const { name, value, type, files } = e.target;

  if (type === "file" && files && files.length > 0) {
    setImageFile(files[0]);
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

const toggleRole = () => {
  if (adminExisting) return;
  setFormData((prev) => ({
    ...prev,
    role: prev.role === "admin" ? "rh" : "admin",
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);

    if (imageFile) {
      data.append("image", imageFile);
    }

    await createUser(data); 
    setSuccessMessage("User Created Created Successfully ! please verify your email");
    setLoading(false);
    setTimeout(() => {
        navigate("/");
    },3000);
  } catch (error) {
    setLoading(false);
    setError(error.message || "Failed to create user. Please try again later.");
  }
};
    return (
        <div className="content">
            <div className="container">
                <div className="row w-100">
                    <div className="col-md-6 order-md-2 d-flex flex-column align-items-center justify-content-center text-center" style={{ marginTop: "-40px" }}>
                        <Lottie
                            animationData={RegisterAnimation}
                            className="img-fluid  lottie-animation"
                            style={{ width: '400px', height: '300px' }}
                        />

                        <div
                            className="form-group text-center mt-1"
                            onClick={toggleRole}
                            style={{ cursor: adminExisting ? 'not-allowed' : 'pointer' }}
                        >
                            
                            <p>Select Role (Click to toggle):</p>
                            {formData.role === 'admin' ? (
                                <div className="role-option active">
                                    <Lottie animationData={adminAnime} style={{ width: '80px', height: '80px' }} />
                                    <span>Admin</span>
                                </div>
                            ) : (
                                <div className="role-option active">
                                    <Lottie animationData={rhAnime} style={{ width: '80px', height: '80px' }} />
                                    <span>RH</span>
                                </div>
                            )}
                            {adminExisting && (
                                <small className="text-muted">
                                    Admin Role Creation disabled (admin already exists)
                                </small>
                            )}
{error && (
  <div className="text-danger small mt-2">
    {Array.isArray(error)
      ? error.map((e, idx) => <p key={idx}>{e.constraints ? Object.values(e.constraints).join(', ') : JSON.stringify(e)}</p>)
      : error.toString()}
  </div>
)}
                        </div>
                    </div>


                    <div className="col-md-6 contents">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="mb-4">
                                    <h3>
                                        Create Account on <strong>Mini CRM</strong>
                                    </h3>
                                    <p className="mb-4">
                                        Fill in the details below to register.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="form-group first">
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group last mb-3">
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label"></label>
                                        <input
                                            type="file"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <input
                                        type="submit"
                                        value={Loading ? "Creating..." : "Create Account"}
                                        className="btn text-white btn-block btn-primary mt-4"
                                        disabled={Loading}
                                    />
                                    {successMessage && (
                                        <p className="text-success small mt-2">{successMessage}</p>
                                    )}

                                    <span className="d-block text-left my-4 text-muted">
                                        Already have an account?{" "}
                                        <a href="/login" className="text-primary">Login</a>
                                    </span>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default CreateUser;