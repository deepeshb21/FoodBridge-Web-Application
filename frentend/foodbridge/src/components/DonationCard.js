import React from 'react';
import API from '../api/axios';

const STATUS_OPTIONS = ['pending', 'accepted', 'picked', 'completed', 'rejected'];

const DonationCard = ({ donation, onStatusChange }) => {
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      await API.put(`/donations/${donation._id}/status`, { status: newStatus });
      alert('Status updated!');
      if (onStatusChange) onStatusChange(); 
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="card mb-3 p-3">
      <h5>Donor: {donation.donorId?.name || 'Anonymous'}</h5>
      <p>Food: {donation.foodDetails}</p>
      <p>Quantity: {donation.quantity}</p>
      <p>Pickup: {donation.pickupAddress}</p>
      <p>Status: <strong>{donation.status}</strong></p>

      <select className="form-select w-auto mt-2" value={donation.status} onChange={handleStatusChange}>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
};

export default DonationCard;
