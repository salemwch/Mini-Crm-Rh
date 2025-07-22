import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreatedAdmin } from "../../../service/user";
import { AuthContext } from "../../../components/AuthProvider";

const CreateAdmin = () => {
  const { user } = useContext(AuthContext); 

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append('image', image);

    try {
      const result = await CreatedAdmin(data); 
      setSuccess(result.message);
      setError('');
      navigate('/');
    } catch (error) {
      setError(error.message || 'Failed to create admin');
    }
  };






    return (
    <div className="container-xl px-4 mt-4">
      <hr className="mt-0 mb-4" />
      <div className="row">
        <div className="col-xl-4">
          <div className="card mb-4 mb-xl-0">
            <div className="card-header">Profile Picture</div>
            <div className="card-body text-center" 
            >
              <img
                className="img-account-profile rounded-circle mb-2"
                src={
                  image ? URL.createObjectURL(image) : "http://bootdey.com/img/Content/avatar/avatar1.png"
                }
                alt="Admin Preview"
                              style={{ width: '160px', height: '160px', objectFit: 'cover' }}

              />
              <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
              <input type="file" className="form-control" onChange={handleImageChange} />
            </div>
          </div>
        </div>

        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header">Account Details</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="small mb-1">Username</label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    placeholder="Enter your username"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="small mb-1">Email address</label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="small mb-1">Phone number</label>
                  <input
                    className="form-control"
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="small mb-1">Password</label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                  />
                </div>
                <button className="btn btn-primary" type="submit">Create Admin</button>
              </form>
              {error && <div className="text-danger mt-3">{error}</div>}
              {success && <div className="text-success mt-3">{success}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;