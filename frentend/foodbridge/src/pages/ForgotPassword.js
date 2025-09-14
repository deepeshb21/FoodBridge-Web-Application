import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from '../api/axios'; 
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    try {
      setLoading(true);
      const response = await axios.post('/users/forgot-password', { email });
      toast.success(response.data.message || 'Password reset link sent!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="glass-card p-4 shadow-lg rounded" style={{ maxWidth: '420px', width: '100%' }}>
        <h2 className="text-center mb-4 fw-bold text-success">Forgot Password</h2>
        <form onSubmit={handleReset}>
          <div className="form-group mb-3">
            <label>Email</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
              <input
                type="email"
                className="form-control"
                required
                placeholder="Your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="text-center mt-3">
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
