import React, { useState, useContext } from 'react';
import { createEnterprise } from '../../../service/interprise';
import { AuthContext } from '../../../components/AuthProvider';
import TopBanner from '../../../components/TopBar';

const CreateEnterpriseForm = () => {
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    secteur: '',
    address: '',
    isActive: true,
    website: '',
    industryCode: '',
    notes: '',
    rating: 0,
    phone: '',
    documents: [],
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name  === 'rating' ? Number(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 5 * 1024 * 1024) {
      setImage(file);
    } else {
      setError('Only JPG/PNG images up to 5MB are allowed.');
      setImage(null);
    }
  };

  const handleDocumentsChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      documents: files.map((file) => file.name),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {

      const payload = {
        ...formData,
        rating: Number(formData.rating),
      };

      await createEnterprise(payload);

      setSuccess('Enterprise created successfully.');
      setFormData({
        name: '',
        secteur: '',
        address: '',
        isActive: true,
        website: '',
        industryCode: '',
        notes: '',
        phone: '',
        rating: 0,
        documents: [],
      });
      setImage(null);
    } catch (err) {
      setError(err.message || 'Failed to create enterprise.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <TopBanner/>
    <div className="container-xl px-4 mt-4">
      <hr className="mt-0 mb-4" />
      <div className="row">
        <div className="col-xl-4">
          <div className="card mb-4 mb-xl-0">
            <div className="card-header">Profile Picture</div>
            <div className="card-body text-center">
              <img
                className="img-account-profile rounded-circle mb-2"
                src={image ? URL.createObjectURL(image) : "http://bootdey.com/img/Content/avatar/avatar1.png"}
                alt="Enterprise Preview"
                style={{ width: '160px', height: '160px', objectFit: 'cover' }}
              />
              <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
              <input type="file" className="form-control" accept="image/png, image/jpeg" onChange={handleImageChange} />
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header">Enterprise Details</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="small mb-1" htmlFor="name">Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Enter enterprise name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="small mb-1" htmlFor="secteur">Secteur *</label>
                  <input
                    id="secteur"
                    name="secteur"
                    type="text"
                    className="form-control"
                    placeholder="Enter secteur"
                    value={formData.secteur}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="small mb-1" htmlFor="address">Address *</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="form-control"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3 form-check">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isActive">Active</label>
                </div>

                <div className="mb-3">
                  <label className="small mb-1" htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    className="form-control"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="small mb-1" htmlFor="industryCode">Industry Code</label>
                  <input
                    id="industryCode"
                    name="industryCode"
                    type="text"
                    className="form-control"
                    placeholder="Enter industry code"
                    value={formData.industryCode}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="small mb-1" htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="form-control"
                    placeholder="Additional notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                  <div className="mb-3">
                  <label className="small mb-1" htmlFor="rating">Rating (0 to 5)</label>
                  <input
                    id="rating"
                    name="rating"
                    type="number"
                    className="form-control"
                    placeholder="0"
                    min={0}
                    max={5}
                    value={formData.rating}
                    onChange={handleChange}
                  />
                </div>
              <div className="mb-3">
                  <label className="small mb-1" htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="texte"
                    className="form-control"
                    placeholder="Enter you phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="small mb-1" htmlFor="documents">Documents (multiple files allowed)</label>
                  <input
                    id="documents"
                    name="documents"
                    type="file"
                    className="form-control"
                    multiple
                    onChange={handleDocumentsChange}
                  />
                </div>
                {console.log('Submitting payload:', formData)
}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Enterprise'}
                </button>
              </form>

{error && Array.isArray(error) && (
  <div className="text-danger mt-3">
    {error.map((errObj, idx) => (
      <div key={idx}>
        {Object.values(errObj.constraints).map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    ))}
  </div>
)}
{success && <div className="text-success mt-3">{success}</div>}
              {success && <div className="text-success mt-3">{success}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CreateEnterpriseForm;
