import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../components/AuthProvider"
import { updateUser } from "../../../service/user";
import TopBanner from "../../../components/TopBar";

const RhProffile = (changePassword) => {

    const {user, setUser} = useContext(AuthContext);
    const IMAGE_BASE_URL = 'http://localhost:3000/uploads/';
 
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        image: null,
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorProfile, setErrorProfile] = useState('');
    const [successProfile, setSuccessProfile] = useState('');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [loadingPassword, setLoadingPassword] = useState(false);
    const [errorPassword, setErrorPassword] = useState('');
    const [successPassword, setSuccessPassword] = useState('');

    useEffect(() => {
        if(user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                image: null,
            }));
            setPreviewImage(
                user.image && user.image !== 'null' && user.image !== 'undefined'
                ? `${IMAGE_BASE_URL}${user.image}`
                : '/image/Profile.png'
            );
        }
    }, [user]);
    const handlechange = (e) =>{
        const { name, value , files} = e.target;
        setErrorProfile('');
        setSuccessProfile('');

        if(name === 'image'){
            const file = files[0];
            if(file){
                setFormData((prev) =>({
                    ...prev,
                    image: file,
                }));
                const reader = new FileReader();
                reader.onload = () => setPreviewImage(reader.result);
                reader.readAsDataURL(file);
            }
        }else{
            setFormData((prev) => ({...prev, [name]: value}));
        }
    };
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoading(true);
        setErrorProfile('');
        setSuccessProfile('');

        try{
            if(!user || !user.id){
                throw new Error('user Id not availble for profile update');
            }
            const response = await updateUser(user.id, formData);
            const updatedUserObject = response.user;
            setUser({
                ...updatedUserObject,
                id: updatedUserObject._id,
            });
            setPreviewImage(
                updatedUserObject.image
                ? `${IMAGE_BASE_URL}/${updatedUserObject.image}?v=${Date.now()}`
                : '/image/Profile.png'
            );
            setSuccessProfile('Profile updated successfully');
        }catch(error){
            console.error('Profile update error:', error);
            setErrorProfile(error.message || 'Failed to update Profile')
        }finally{
            setLoading(false);
        }
    };
      const getUserImageSrc = (image) => {
  if (!image || image === 'null' || image === 'undefined') {
    return '/image/profile.png';
  }
  return `${IMAGE_BASE_URL}/${image}?v=${Date.now()}`;
};


    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmNewPassword} = passwordData;
        setLoadingPassword(true);
        setErrorPassword('');
        setSuccessPassword('');
        if(!currentPassword || !newPassword || !confirmNewPassword){
            setErrorPassword('Please fill all password fiels');
            setLoading(false);
            return;
        }
        if(newPassword !== confirmNewPassword && newPassword === currentPassword){
            setErrorPassword('New Password do not match and cannot be the same as the current password');
            setLoading(false);
            return;
        }
        try{
            if(!user || !user.id){
                throw new Error('User Id not Available for password chnage.');
            }
            await changePassword(user.id, {currentPassword, newPassword});
            setSuccessPassword('password chnages successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
        }catch(error){
            console.error('Password change error:', error);
            setErrorPassword(error.response?.data?.message || error.message || 'failed to chnage password');
        }finally{
            setLoadingPassword(false);
        }
    };
    if(!user){
    return <div className="p-12 text-center text-muted">Loading user info...</div>;
    }


    return (
      <div className="bg-transparent min-h-screen pt-8">
            <TopBanner />
  <div className="container-xl px-4 mt-4">
    <hr className="mt-0 mb-4" />
    <div className="row">
      <div className="col-xl-4">
        <div className="card mb-4 mb-xl-0">
          <div className="card-header">Profile Picture</div>
          <div
            className="card-body text-center"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              textAlign: 'center',
            }}
          >
            <img
              className="img-account-profile rounded-circle mb-2"
              src={previewImage || getUserImageSrc(user?.image || '')}
              alt="user-profile"
              style={{ width: '160px', height: '160px', objectFit: 'cover' }}
            />
            <div className="small font-italic text-muted mb-4">
              JPG or PNG no larger than 5 MB
            </div>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlechange}
            />
            <label htmlFor="image" className="btn btn-primary" style={{ cursor: 'pointer' }}>
              Upload new image
            </label>
          </div>
          
        </div>
        <div className="card mt-3 mb-4">
          <div className="card-header">Change Password</div>
          <div className="card-body">
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="small mb-1" htmlFor="currentPassword">
                  Current Password
                </label>
                <input
                  className="form-control"
                  name="currentPassword"
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword || ''}
                  onChange={handlePasswordSubmit}
                />
              </div>
              <div className="mb-3">
                <label className="small mb-1" htmlFor="newPassword">New Password</label>
                <input
                  className="form-control"
                  name="newPassword"
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={passwordData.newPassword || ''}
                  onChange={handlePasswordSubmit}
                />
              </div>
              <div className="mb-3">
                <label className="small mb-1" htmlFor="confirmNewPassword">
                  Confirm New Password
                </label>
                <input
                  className="form-control"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  value={passwordData.confirmNewPassword || ''}
                  onChange={handlePasswordSubmit}
                  autoComplete="new-password"
                />
              </div>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loadingPassword}
              >
                {loadingPassword ? 'Changing...' : 'Change Password'}
              </button>
{Array.isArray(errorPassword)
  ? errorPassword.map((err, idx) => (
      <div key={idx} className="text-danger mt-2">
        {Object.values(err.constraints).map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    ))
  : errorPassword?.constraints && (
      <div className="text-danger mt-2">
        {Object.values(errorPassword.constraints).map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    )}

              {successPassword && <p className="text-success mt-2">{successPassword}</p>}
            </form>
          </div>
        </div>
      </div>

      <div className="col-xl-8">
        <div className="card mb-4">
          <div className="card-header">Profile Details</div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="small mb-1" htmlFor="name">Name</label>
                <input
                  className="form-control"
                  name="name"
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name || ''}
                  onChange={handlechange}
                />
              </div>
              <div className="mb-3">
                <label className="small mb-1" htmlFor="email">Email address</label>
                <input
                  className="form-control"
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email || ''}
                  onChange={handlechange}
                />
              </div>
              <div className="mb-3">
                <label className="small mb-1" htmlFor="createdAt">Account Created</label>
                <input
                  className="form-control"
                  name="createdAt"
                  id="createdAt"
                  type="text"
                  disabled
                  value={user?.createdAt ? new Date(user.createdAt).toLocaleString() : ''}
                />
              </div>
              <div className="mb-3">
                <label className="small mb-1" htmlFor="updatedAt">Account Updated</label>
                <input
                  className="form-control"
                  name="updatedAt"
                  id="updatedAt"
                  type="text"
                  disabled
                  value={user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : ''}
                />
              </div>
              <div className="mb-3">
                <label className="small mb-1" htmlFor="role">Role</label>
                <input
                  className="form-control"
                  name="role"
                  id="role"
                  type="text"
                  disabled
                  value={user?.role || ''}
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              {Array.isArray(errorProfile)
  ? errorProfile.map((err, index) =>
      Object.values(err.constraints).map((msg, idx) => (
        <p key={`${index}-${idx}`} className="text-danger mt-2">{msg}</p>
      ))
    )
  : errorProfile && <p className="text-danger mt-2">{errorProfile}</p>}

              {successProfile && <p className="text-success mt-2">{successProfile}</p>}
            </form>
          </div>
        </div>
        
      </div>
    </div>
  </div>
  </div>
);
}

export default RhProffile;