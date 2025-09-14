import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DonorDashboard = () => {
  const { user, userRole } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (userRole === 'donor') {
      axios.get('/api/donations/stats')
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
    }
  }, [userRole]);

  if (!user || userRole !== 'donor') return <p className="text-center mt-5">Access denied</p>;
  if (!stats) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-success">Donor Dashboard</h2>

      <div className="row mb-4">
        {['totals','pending','accepted','rejected','completed'].map((key, idx) => (
          <div key={idx} className="col-md-2 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h3>{stats[key]}</h3>
                <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h5>Recent Donations</h5>
      {stats.recentDonations.length === 0 ? (
        <p>No recent donations.</p>
      ) : (
        stats.recentDonations.map(d => (
          <div key={d._id} className="card mb-2">
            <div className="card-body">
              <strong>NGO:</strong> {d.ngoId.name}<br />
              <strong>Food:</strong> {d.foodDetails}<br />
              <strong>Status:</strong> {d.status}
            </div>
          </div>
        ))
      )}

      <Link to="/my-donations" className="btn btn-link mt-3">
        View all donations →
      </Link>
    </div>
  );
};

export default DonorDashboard;
