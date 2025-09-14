
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const STATUS_CLASS = {
  pending: 'text-warning',
  accepted: 'text-success',
  rejected: 'text-danger',
  completed: 'text-primary',
};

const MyDonations = () => {
  const { userRole } = useAuth();
  const [dons, setDons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/donations/my')
      .then(res => {
        setDons(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('My donations error:', err);
        setLoading(false);
      });
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this donation?')) return;
    try {
      await API.delete(`/donations/${id}`);
      setDons(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };


  if (userRole !== 'donor') return <p className="text-center mt-5">Access denied</p>;
  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-success">My Donations</h2>
      {dons.length === 0 && <p>No donations yet</p>}
      {dons.map(d => (
        <div key={d._id} className="card mb-3 p-3">
          <h5>To NGO: {d.ngoId?.name || "Unknown NGO"}</h5>
          <p>Food: {d.foodDetails} | Qty: {d.quantity}</p>
          <p>Pickup: {d.pickupAddress} {d.pickupTime}</p>
          <p>Status: <span className={STATUS_CLASS[d.status]}>{d.status}</span></p>
          {d.status === 'pending' && (
            <button className="btn btn-danger btn-sm" onClick={() => cancel(d._id)}>
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyDonations;
