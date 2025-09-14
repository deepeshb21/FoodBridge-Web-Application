import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const userType = queryParams.get('type') || 'donor';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    licenseId: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    if (userType === 'ngo' && (!formData.address || !formData.licenseId)) {
      alert('NGO must provide address and license ID');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userType }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful!');

        if (data.token) {
          login({ user: data.user, role: data.user.userType });
          navigate('/');
        } else {
          navigate('/login');
        }
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert('Something went wrong during registration.');
    }
  };

  return (
    <motion.div
      className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="glass-card p-4 shadow-lg rounded" style={{ maxWidth: '460px', width: '100%' }}>
        <h2 className="text-center mb-4 fw-bold text-success">
          {userType === 'ngo' ? 'Register as NGO' : 'Register on FoodBridge'}
        </h2>
        <form onSubmit={handleRegister}>
          <div className="form-group mb-3">
            <label>Name</label>
            <div className="input-group">
              <span className="input-group-text"><FaUser /></span>
              <input type="text" name="name" className="form-control" onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
              <input type="email" name="email" className="form-control" onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input type="password" name="password" className="form-control" onChange={handleChange} required />
            </div>
          </div>

          {userType === 'ngo' && (
            <>
              <div className="form-group mb-3">
                <label>Address</label>
                <div className="input-group">
                  <span className="input-group-text"><FaMapMarkerAlt /></span>
                  <input type="text" name="address" className="form-control" onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>License ID</label>
                <div className="input-group">
                  <span className="input-group-text"><FaIdCard /></span>
                  <input type="text" name="licenseId" className="form-control" onChange={handleChange} required />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
