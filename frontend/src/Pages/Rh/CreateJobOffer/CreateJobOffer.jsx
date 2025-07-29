import React, { useState, useEffect } from 'react';
import { createJobOffer } from '../../../service/jobOffer';
import { getMyEnterprises } from '../../../service/interprise';
import TopBanner from '../../../components/TopBar';

const CreateJobOfferForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    enterpriseId: '',
    location: '',
    salary: '',
    expiryDate: '',
  });
  const [enterprises, setEnterprises] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserEnterprises = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const myEnterprises = await getMyEnterprises();
        setEnterprises(myEnterprises);
        if (myEnterprises && myEnterprises.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            enterpriseId: myEnterprises[0]._id,
          }));
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch your enterprises. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserEnterprises();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.enterpriseId) {
        setError("Please select an enterprise.");
        return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');

    try {
      const createJobOfferDto = {
        ...formData,
        requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req),
        salary: Number(formData.salary),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate): undefined,
      };

      const response = await createJobOffer(createJobOfferDto);
      setSuccessMessage(`Successfully created job offer: "${response.title}"!`);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while creating the job offer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <TopBanner/>
    <div className="container-xl px-4 mt-4">
      <hr className="mt-0 mb-4" />
      <div className="row">
        <div className="col-xl-2">
        </div>
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header">Create New Job Offer</div>
            <div className="card-body">
              {isLoading && <p className="text-center">Loading your enterprises...</p>}

              {successMessage && <div className="alert alert-success">{successMessage}</div>}

{error && (
  <div className="alert alert-danger">
    {Array.isArray(error)
      ? error.map((e, idx) => <p key={idx}>{e.constraints ? Object.values(e.constraints).join(', ') : JSON.stringify(e)}</p>)
      : error.toString()}
  </div>
)}

              {!isLoading && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="title">Job Title</label>
                    <input className="form-control" id="title" name="title" type="text" placeholder="e.g., Senior Software Engineer" value={formData.title} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="enterpriseId">Enterprise</label>
                    <select className="form-control" id="enterpriseId" name="enterpriseId" value={formData.enterpriseId} onChange={handleChange} required disabled={enterprises.length === 0}>
                      {enterprises.length === 0 ? (
                        <option>No enterprises found</option>
                      ) : (
                        enterprises.map(enterprise => (
                          <option key={enterprise._id} value={enterprise._id}>
                            {enterprise.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="description">Description</label>
                    <textarea className="form-control" id="description" name="description" rows="4" placeholder="Enter a detailed job description" value={formData.description} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="requirements">Requirements</label>
                    <textarea className="form-control" id="requirements" name="requirements" rows="3" placeholder="Enter requirements, separated by commas" value={formData.requirements} onChange={handleChange} required />
                    <div className="small text-muted">Separate each requirement with a comma (e.g., React, Node.js, 5+ years experience).</div>
                  </div>

                  <div className="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="location">Location (Optional)</label>
                      <input className="form-control" id="location" name="location" type="text" placeholder="e.g., San Francisco, CA or Remote" value={formData.location} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="salary">Salary</label>
                      <input className="form-control" id="salary" name="salary" type="number" placeholder="e.g., 90000" value={formData.salary} onChange={handleChange} required />
                    </div>
                  </div>
                      <div className="mb-3">
  <label className="small mb-1" htmlFor="expiryDate">Expiry Date (optional)</label>
  <input
    className="form-control"
    id="expiryDate"
    name="expiryDate"
    type="date"
    value={formData.expiryDate}
    onChange={handleChange}
  />
</div>

                  <button className="btn btn-primary" type="submit" disabled={isSubmitting || isLoading}>
                    {isSubmitting ? 'Creating...' : 'Create Job Offer'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CreateJobOfferForm;