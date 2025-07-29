import {  useEffect, useState } from "react";
import { getMyEnterprises } from "../../../service/interprise";
import { createContact, getEnterprisesWithContacts } from "../../../service/Contact";
import { getEnterpriseByUserId, getUsersByRole } from "../../../service/user";


const CreateContactsByEnterprise = () => {
    const [myEnterprises, setMyEnterprises] = useState([]); 
const [successMessage, setSuccessMessage] = useState('');
const [rhUsers, setRhUsers] = useState([]);
const [selectedRhUser, setSelectedRhUser] = useState(null);
const [enterprise, setEnterprise] = useState(null);

const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  position: "",
  preferedContactMethod: "email",
  isActive: true,
  enterpriseId: "",
});

const [loadingUsers, setLoadingUsers] = useState(true);
const [loadingEnterprise, setLoadingEnterprise] = useState(false);
const [error, setError] = useState("");

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const users = await getUsersByRole("rh");
      setRhUsers(users);
    } catch (err) {
      console.error("Error fetching RH users", err);
      setError("Failed to fetch RH users");
    } finally {
      setLoadingUsers(false);
    }
  };
  fetchUsers();
}, []);
 const handleSelectUser = async (user) => {
  setSelectedRhUser(user);
  setLoadingEnterprise(true);
  setError("");
  try {
    const enterprise = await getEnterpriseByUserId(user._id);
    setEnterprise(enterprise);
    setMyEnterprises([enterprise]);
    setForm((prev) => ({ ...prev, enterpriseId: enterprise._id }));
  } catch (err) {
    console.error("Failed to load enterprise", err);
    setError("Could not load enterprise for selected user");
  } finally {
    setLoadingEnterprise(false);
  }
};
   
    const [loading, setLoading] = useState(true);
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
    setSuccessMessage("Contact created successfully!");
    setForm({
      name: "",
      email: "",
      phone: "",
      position: "",
      preferedContactMethod: "email",
      isActive: true,
      enterpriseId: form.enterpriseId,
    });
  } catch (err) {
    setError(err.message || "Failed to create contact");
  }
};

if (loadingUsers) return <p>Loading RH users...</p>;

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
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                  <div className="mb-3">
  <label className="small mb-1">Select RH User</label>
  <select
    className="form-control"
    onChange={(e) => {
      const selected = rhUsers.find((u) => u._id === e.target.value);
      if (selected) handleSelectUser(selected);
    }}
  >
    <option value="">Select a user...</option>
    {rhUsers.map((user) => (
      <option key={user._id} value={user._id}>
        {user.name || user.email}
      </option>
    ))}
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
         {successMessage && (
  <div className="mt-2 text-success">
    {successMessage}
  </div>
)}
{error && (
  <div className="mt-2 text-danger">
    {error}
  </div>
)}

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default  CreateContactsByEnterprise;
