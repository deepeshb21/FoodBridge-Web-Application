import React from 'react';
import ReceivedDonations from './ReceivedDonations';

const NgoDashboard = () => (
  <div className="container mt-5">
    <h2 className="text-success mb-4">NGO Dashboard</h2>
    <p>Here you can view and manage incoming donations.</p>
    <ReceivedDonations />
  </div>
);

export default NgoDashboard;
