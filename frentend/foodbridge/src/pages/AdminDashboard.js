import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { FaUsers, FaHandsHelping, FaUserClock } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalNGOs: 0,
    totalDonations: 0,
    unverifiedNGOs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/users/ngo-stats')
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Error fetching NGO stats:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-success">Admin Dashboard</h2>

      {loading ? (
        <p>Loading stats…</p>
      ) : (
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card border-success shadow-sm">
              <div className="card-body d-flex align-items-center">
                <FaUsers size={28} className="me-3 text-success" />
                <div>
                  <h6 className="card-title mb-1">Total NGOs</h6>
                  <h4 className="mb-0">{stats.totalNGOs}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card border-info shadow-sm">
              <div className="card-body d-flex align-items-center">
                <FaHandsHelping size={28} className="me-3 text-info" />
                <div>
                  <h6 className="card-title mb-1">Total Donations</h6>
                  <h4 className="mb-0">{stats.totalDonations}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card border-warning shadow-sm">
              <div className="card-body d-flex align-items-center">
                <FaUserClock size={28} className="me-3 text-warning" />
                <div>
                  <h6 className="card-title mb-1">Pending NGO Approvals</h6>
                  <h4 className="mb-0">{stats.unverifiedNGOs}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} 
    </div>
  );
};

export default AdminDashboard;
