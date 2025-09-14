import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import About from './pages/AboutUs';
import Contact from './pages/ContactUs';
import Register from './components/Register';
import Login from './components/Login';
// import ForgotPassword from './pages/ForgotPassword';
import DonateForm from './pages/DonateFrom';
import DonateRedirect from './pages/DonateRedirect';
import JoinNGO from './pages/JoinNgo';
import Profile from './pages/Profile';
import NgoDashboard from './pages/NgoDashboard';
import Dashboard from './components/Dashboard';
import MyDonations from './pages/MyDonations';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './context/AuthContext';
// import DonorDashboard from './pages/DonarDashboard';
import adminRoutes from './admin-dashboard/routes/adminRoutes';
import PrivateAdminRoute from './utils/PrivateAdminRoute';
import DashboardHome from './admin-dashboard/DashboardHome';
import ManageNGOs from './admin-dashboard/ManageNGOs';
import AllDonations from './admin-dashboard/AllDonations';
import AdminLayout from './admin-dashboard/AdminLayout';

function App() {
  const { user, userRole } = useAuth();

  return (
    <NotificationProvider user={user}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        <Route path="/join-ngo" element={<JoinNGO />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />


        <Route path="/donate-here" element={<DonateRedirect user={user} />} />
        <Route path="/donate" element={user ? <DonateForm /> : <Navigate to="/login" />} />
        <Route path="/my-donations" element={user && userRole === 'donor' ? <MyDonations /> : <Navigate to="/login" />} />

        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        {/* <Route path="/donor-dashboard" element={user && userRole === 'donor' ? <DonorDashboard /> : <Navigate to="/login" />} /> */}

        <Route path="/admin" element={<PrivateAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="ngos" element={<ManageNGOs />} />
            <Route path="donations" element={<AllDonations />} />
          </Route>
        </Route>


        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </NotificationProvider>
  );
}

export default App;
