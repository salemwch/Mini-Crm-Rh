import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login';
import ForgetPassword from './Auth/forgetPassword';
import ResetPassword from './Auth/ResetPassword';
import CreateUser from './Auth/Register';
import EmailVerified from './Auth/verified/EmailVerified';
import SideBar from './Pages/Admin/sideBar/SideBar';
import PrivateRoute from './components/PrivateRoute';
import UsersTable from './Pages/Admin/UserTable/UserTable';
import UserProfile from './Pages/Admin/Profile/UserProfile';
import CreateAdmin from './Pages/Admin/CreateAdmin/createAdmin';
import Dashboard from './Pages/Admin/dashboard/Dashboard';
import RhDashboard from './Pages/Rh/RhDashboard';
import UserCardCarousel from './components/UserCardCarrousel';
import AbsenceCalendar from './components/Calendar';

import RhProffile from './Pages/Rh/Profile/RhProfile';
import RhSidebar from './components/RhSidebar';
import { useState } from 'react';
import CreateEnterpriseForm from './Pages/Rh/Enterprise/CreateEnterprise';
import CreateJobOfferForm from './Pages/Rh/CreateJobOffer/CreateJobOffer';
import EnterprisesTable from './Pages/Rh/Enterprise/EnterpriseTable';
import EnterpriseInfoPage from './Pages/Rh/Enterprise/EnterpriseInfoPage';
import JobOfferByEnterprise from './Pages/Rh/CreateJobOffer/JobOffer.jsx/FetchJobOfferByEnterprise';
import UpdateJobOffer from './Pages/Rh/CreateJobOffer/JobOffer.jsx/EditJobOffer';
import CreateContacts from './Pages/Rh/Contacts/CreateContacts';

function App() {
const [isOpen, setOpen] = useState(true);



  return (
    <BrowserRouter>
    
    <div className="flex flex-col min-h-screen w-full">

    <Routes>
      <Route path='/user-carrousel' element={<UserCardCarousel/>}/>
      <Route path="/" element={<Login/>}/>
      <Route path="/auth/forget-password" element={<ForgetPassword/>}/>
      <Route path="/auth/reset-password/:token" element={<ResetPassword/>}/>
      <Route path="/register" element={<CreateUser/>}/>
      <Route path ='/email-verified' element={<EmailVerified/>}/>
      <Route
    element={<PrivateRoute roles={['admin']}>
        <SideBar />
      </PrivateRoute>}>
    <Route path="/user-list" element={<UsersTable />} />
    <Route path="/user-profile" element={<UserProfile />} />
    <Route path="/create-user" element={<CreateAdmin />}/>
    <Route path="/Admin-Dashboard" element={<Dashboard/>}/>
    <Route path='/admin-enterprises' element={<CreateEnterpriseForm/>} />

  </Route>




    <Route element={<PrivateRoute roles={['rh']}>
      <RhSidebar isOpen={isOpen} setOpen={setOpen} />
      </PrivateRoute>}>

  <Route path='/Rh-Dashboard' element={<RhDashboard />} />
  <Route path='/calendar' element={<AbsenceCalendar />} />
  <Route path='/Rh-Profile' element={<RhProffile />} />
  <Route path='/rh-enterprises' element={<CreateEnterpriseForm/>} />
  <Route path='/CreateJobOffer' element={<CreateJobOfferForm/>}/>
  <Route path='/List-enterprises' element={<EnterprisesTable/>}/>
  <Route path='/Enterprise-info/:id' element={<EnterpriseInfoPage/>}/>
  <Route path="/job-offer/by-enterprise/:id" element={<JobOfferByEnterprise />} />
  <Route path='/edit-job-offer/:id' element={<UpdateJobOffer/>}/>
<Route path="/contacts/create" element={<CreateContacts />} />

</Route>

    </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
