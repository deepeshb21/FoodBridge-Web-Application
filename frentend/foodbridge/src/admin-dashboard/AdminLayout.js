import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex">
      <button
        className="btn btn-dark d-md-none position-fixed top-0 start-0 m-2 z-3"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ zIndex: 1050 }}
      >
        <FaBars />
      </button>

     
      <aside
        className={`bg-dark text-white p-3 ${sidebarOpen ? 'd-block' : 'd-none'} d-md-block`}
        style={{ width: '250px', minHeight: '100vh' }}
      >
        <h4 className="mb-4">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <button
              className={`btn btn-link text-start w-100 ${
                isActive('/admin') ? 'fw-bold text-warning' : 'text-white'
              }`}
              onClick={() => {
                navigate('/admin');
                setSidebarOpen(false);
              }}
            >
              Dashboard
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn btn-link text-start w-100 ${
                isActive('/admin/ngos') ? 'fw-bold text-warning' : 'text-white'
              }`}
              onClick={() => {
                navigate('/admin/ngos');
                setSidebarOpen(false);
              }}
            >
              Manage NGOs
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn btn-link text-start w-100 ${
                isActive('/admin/donations') ? 'fw-bold text-warning' : 'text-white'
              }`}
              onClick={() => {
                navigate('/admin/donations');
                setSidebarOpen(false);
              }}
            >
              Manage Donations
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn btn-link text-start w-100 ${
                isActive('/admin/profile') ? 'fw-bold text-warning' : 'text-white'
              }`}
              onClick={() => {
                navigate('/profile');
                setSidebarOpen(false);
              }}
            >
              Profile
            </button>
          </li>
        </ul>
      </aside>

     
      <main className="flex-grow-1 p-4 bg-light" style={{ marginLeft: '0' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
