import { useContext, useEffect, useState } from "react";
import { getMyEnterprises } from "../../../service/interprise";
import { createContact } from "../../../service/Contact";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../components/AuthProvider";

const CreateContacts = () => {
  const [myEnterprises, setMyEnterprises] = useState([]);
  const { enterpriseId } = useParams();
  const {user} = useContext(AuthContext)

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    preferedContactMethod: "email",
    isActive: true,
    enterpriseId: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyEnterprises = async () => {
      try {
        const data = await getMyEnterprises();
        console.log(data);
        setMyEnterprises(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, enterpriseId: data[0]._id }));
        }
      } catch (err) {
        setError(err?.message || "Failed to load enterprises");
      } finally {
        setLoading(false);
      }
    };
    fetchMyEnterprises();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createContact(form);
      console.log(form);
      toast.success("Contact created successfully");
      setForm({
        name: "",
        email: "",
        phone: "",
        position: "",
        preferedContactMethod: "email",
        isActive: true,
        enterprise: enterpriseId,
      });
    } catch (err) {
      toast.error(err.message || "Failed to create contact");
      console.log(err)
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container-xl px-4 mt-4">
      <hr className="mt-0 mb-4" />
      <div className="row">
        <div className="col-xl-4">
          <div className="card mb-4 mb-xl-0">
            <div className="card-header">Profile Picture</div>
            <div className="card-body text-center">
              <img
                className="img-account-profile rounded-circle mb-2"
                src="http://bootdey.com/img/Content/avatar/avatar1.png"
                alt="avatar"
              />
              <div className="small font-italic text-muted mb-4">
                JPG or PNG no larger than 5 MB
              </div>
              <button className="btn btn-primary" type="button" disabled>
                Upload new image
              </button>
            </div>
          </div>
        </div>
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header">Contact Details</div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="small mb-1">Full Name</label>
                  <input
                    className="form-control"
                    name="name"
                    type="text"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1">Phone</label>
                    <input
                      className="form-control"
                      name="phone"
                      type="text"
                      placeholder="Enter phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="small mb-1">Position</label>
                    <input
                      className="form-control"
                      name="position"
                      type="text"
                      placeholder="Enter position"
                      value={form.position}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="small mb-1">Email</label>
                  <input
                    className="form-control"
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1">Preferred Contact Method</label>
                    <select
                      className="form-control"
                      name="preferedContactMethod"
                      value={form.preferedContactMethod}
                      onChange={handleChange}
                    >
                      <option value="EMAIL">Email</option>
                      <option value="PHONE">Phone</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="small mb-1">Enterprise</label>
                    <select
                      className="form-control"
                      name="enterpriseId"
                      value={form.enterpriseId}
                      onChange={handleChange}
                    >
                      {myEnterprises.map((ent) => (
                        <option key={ent._id} value={ent._id}>
                          {ent.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3 form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    id="isActive"
                  />
                  <label className="form-check-label" htmlFor="isActive">
                    Active Contact
                  </label>
                </div>

                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Save Contact
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContacts;
