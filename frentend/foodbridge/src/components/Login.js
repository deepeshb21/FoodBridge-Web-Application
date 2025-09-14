
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Login successful!');
        login(data.user, data.token); 
        navigate('/');

      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong during login.');
    }
  };

  return (
    <motion.div
      className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="glass-card p-4 shadow-lg rounded" style={{ maxWidth: '420px', width: '100%' }}>
        <h2 className="text-center mb-4 fw-bold text-success">Login to FoodBridge</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label>Email</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
              <input
                type="email"
                name="email"
                className="form-control"
                required
                autoComplete="email"
                placeholder="Email address"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                type="password"
                name="password"
                className="form-control"
                required
                autoComplete="current-password"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100">Login</button>
        </form>
        <p className="text-center mt-3">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;