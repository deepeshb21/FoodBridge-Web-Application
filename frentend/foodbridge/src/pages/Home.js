import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../App.css';

const Home = () => {
  return (
    <motion.div
      className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="row align-items-center text-center text-md-start px-4 py-5">
        <motion.div
          className="col-md-6 mb-4"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <h1 className="display-4 fw-bold">
            Welcome to <span className="text-success">FoodBridge</span>
          </h1>
          <p className="lead text-muted">
            Donate your extra food and make a difference in someone’s life.
            Join hands to fight hunger together.
          </p>

          <motion.div
            className="d-flex justify-content-center justify-content-md-start gap-3 mt-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/register"
              className="btn btn-success btn-lg px-4 py-2 shadow home-button"
            >
              Donate Here
            </Link>
            <Link
              to="/register?type=ngo"
              className="btn btn-outline-success btn-lg px-4 py-2 shadow home-button"
            >
              Join NGO
            </Link>

          </motion.div>
        </motion.div>

        <motion.div
          className="col-md-6"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png"
            alt="Food Donation"
            className="img-fluid"
            style={{ maxHeight: '350px' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;

