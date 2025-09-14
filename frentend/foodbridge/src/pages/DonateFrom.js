import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchVerifiedNGOs } from '../api/ngo';
import API from '../api/axios';

const DonateForm = () => {
  const { userRole, token } = useAuth();
  const navigate = useNavigate();

  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    ngoId: '',
    foodDetails: '',
    quantity: '',
    pickupAddress: '',
    pickupTime: '',
    notes: '',
    donationType: 'Cooked',
    foodCategory: 'Other',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const loadNGOs = async () => {
      try {
        const data = await fetchVerifiedNGOs(token);
        setNgos(data);
      } catch (error) {
        console.error('Error fetching NGOs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userRole === 'donor') {
      loadNGOs();
    } else {
      setLoading(false);
    }
  }, [userRole, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post('/donations', formData, {
        withCredentials: true,
      });

      alert('Donation request submitted successfully!');
      navigate('/my-donations');
    } catch (error) {
      console.error('Donation submit error:', error);
      alert(error.response?.data?.message || 'Failed to submit donation');
    }
  };

  if (userRole !== 'donor') return <p className="text-center mt-5">Access denied</p>;
  if (loading) return <p className="text-center mt-5">Loading NGOs...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-success">Donate Food</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Select NGO</label>
          <select
            name="ngoId"
            value={formData.ngoId}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">-- Choose Verified NGO --</option>
            {ngos.map((n) => (
              <option key={n._id} value={n._id}>
                {n.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Food Details</label>
          <textarea
            name="foodDetails"
            value={formData.foodDetails}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Quantity</label>
          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Pickup Address</label>
          <input
            type="text"
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Pickup Time (optional)</label>
          <input
            type="datetime-local"
            name="pickupTime"
            value={formData.pickupTime}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Notes (optional)</label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Donation Type</label>
          <select
            name="donationType"
            value={formData.donationType}
            onChange={handleChange}
            className="form-control"
          >
            <option>Cooked</option>
            <option>Raw</option>
            <option>Packaged</option>
            <option>Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Food Category</label>
          <select
            name="foodCategory"
            value={formData.foodCategory}
            onChange={handleChange}
            className="form-control"
          >
            <option>Fruits</option>
            <option>Vegetables</option>
            <option>Bakery</option>
            <option>Dairy</option>
            <option>Grains</option>
            <option>Other</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          Submit Donation
        </button>
      </form>
    </div>
  );
};

export default DonateForm;
