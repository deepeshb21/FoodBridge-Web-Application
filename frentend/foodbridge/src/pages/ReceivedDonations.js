import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import DonationCard from '../components/DonationCard';

const ReceivedDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/donations/received')
      .then(res => {
        setDonations(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching received donations:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-5">Loading donations…</p>;
  if (!donations.length) return <p className="text-center mt-5">No donations received yet.</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Incoming Donation Requests</h3>
      {donations.map(d => <DonationCard key={d._id} donation={d} />)}
    </div>
  );
};

export default ReceivedDonations;
