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
import EnterprisesTable from './Pages/Rh/Enterprise/EnterpriseTable';
import EnterpriseInfoPage from './Pages/Rh/Enterprise/EnterpriseInfoPage';
import JobOfferByEnterprise from './Pages/Rh/CreateJobOffer/JobOffer.jsx/FetchJobOfferByEnterprise';
import UpdateJobOffer from './Pages/Rh/CreateJobOffer/JobOffer.jsx/EditJobOffer';
import EquipmentStatus from './components/equipementStatus';
import EnterpriseList from './Pages/Enterprises/getAllEnterprise';
import ProfileSection from './Pages/Rh/sectionProfile/ProfileSection';
import UpdateEnterprise from './Pages/Rh/Enterprise/UpdateEnterprise';
import CreateEvents from './Pages/Admin/Events/CreateEvents';
import { ToastContainer } from 'react-toastify';
import EnterprisesSection from './Pages/Admin/Contacts/getContacts';
import CreateFeedback from './Pages/Admin/Feedbacks/CreateFeedback';
import GetAllFeedbacksByEnterprise from './Pages/Admin/Feedbacks/AllFeedbacks';
import CreateContactsByEnterprise from './Pages/Admin/Contacts/Contacts';
import CreateContacts from './Pages/Rh/Contacts/CreateContacts';
import CreateDocumentPage from './Pages/Admin/Documents/CreateDocument';
import EnterpriseListPage from './Pages/Admin/enterprise/EnterpriseListPage';
import EnterpriseDetails from './Pages/Admin/enterprise/EnterpriseListWithDocuments';
import DocumentList from './Pages/Admin/Documents/GetAllDocuments';
import CreateRhEvents from './Pages/Rh/events/CreateEvents';
import GlobalChat from './components/GlobalChat';
import Profile from './Pages/Admin/UsersInfo/UserInfo';
import AuditLogs from './Pages/Admin/auditLog/Auditlogs';

function App() {
const [isOpen, setOpen] = useState(true);
  return (
    <BrowserRouter>
<div className="flex flex-col min-h-screen w-full">
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />    <Routes>
    <Route path='/user-carrousel' element={<UserCardCarousel/>}/>
    <Route path="/" element={<Login/>}/>
    <Route path="/auth/forget-password" element={<ForgetPassword/>}/>
    <Route path="/auth/reset-password/:token" element={<ResetPassword/>}/>
    <Route path="/register" element={<CreateUser/>}/>
    <Route path ='/email-verified' element={<EmailVerified/>}/>

    <Route element={<PrivateRoute roles={['admin']}>
    <SideBar />
    </PrivateRoute>}>
        <Route path='/profile/:id' element={<Profile/>}/>

    <Route path="/user-list" element={<UsersTable />} />
    <Route path="/user-profile" element={<UserProfile />} />
    <Route path="/create-user" element={<CreateAdmin />}/>
    <Route path="/Admin-Dashboard" element={<Dashboard/>}/>
    <Route path='/admin-enterprises' element={<CreateEnterpriseForm/>} />
    <Route path='/admin-events' element={<CreateEvents/>}/>
    <Route path="/Contacts" element={<CreateContactsByEnterprise/>}/>
    <Route path="/All-Contacts" element={<EnterprisesSection/>}/>
    <Route path="/Create-feedback" element={<CreateFeedback/>}/>
    <Route path="/All-Feedbacks" element={<GetAllFeedbacksByEnterprise/>}/>
    <Route path="/create-documents" element={<CreateDocumentPage/>}/>
    <Route path="/enterprises-documents" element={<EnterpriseListPage />} />
    <Route path="/enterprise/:id" element={<EnterpriseDetails/>}/>
    <Route path="/See-documents" element={<DocumentList/>}/>
    <Route path="/audit-log" element={<AuditLogs/>}/>
  </Route>



    <Route element={<PrivateRoute roles={['rh']}>
      <RhSidebar isOpen={isOpen} setOpen={setOpen}/>
      </PrivateRoute>}>
  <Route path='/Rh-Dashboard' element={<RhDashboard />} />
  <Route path='/calendar' element={<AbsenceCalendar />} />
  <Route path='/Rh-Profile' element={<RhProffile />} />
  <Route path='/entreprises/:id' element={<ProfileSection/>}/>
  <Route path='/rh-enterprises' element={<CreateEnterpriseForm/>} />
  <Route path='/List-enterprises' element={<EnterprisesTable/>}/>
  <Route path='/Enterprise-info/:id' element={<EnterpriseInfoPage/>}/>
  <Route path="/job-offer/by-enterprise/:id" element={<JobOfferByEnterprise />} />
  <Route path='/edit-job-offer/:id' element={<UpdateJobOffer/>}/>
  <Route path="/contacts/create" element={<CreateContacts />} />
  <Route path="/RH" element={<EquipmentStatus />} />
  <Route path="/enterprise-list" element={<EnterpriseList />} />
  <Route path="/enterprise/update/:id" element={<UpdateEnterprise />} />
  <Route path="/create-events" element={<CreateRhEvents/>}/>
</Route>

    </Routes>
      <GlobalChat />
    </div>
    </BrowserRouter>
  );
}

export default App;
