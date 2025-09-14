import React from 'react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  return (
    <div className="contact-section container py-5">
      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="fw-bold text-success">Contact <span className="text-dark">Us</span> 📞</h1>
        <p className="text-muted">We’d love to hear from you! Whether you're a donor, NGO, or supporter, reach out to us.</p>
      </motion.div>

      <div className="row">
        <motion.div
          className="col-md-6 mb-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <form className="p-4 border rounded shadow bg-white">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" placeholder="Your name" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Your email" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows="4" placeholder="Your message..." required></textarea>
            </div>
            <button type="submit" className="btn btn-success w-100">Send Message</button>
          </form>
        </motion.div>

        <motion.div
          className="col-md-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="p-4 border rounded shadow bg-light h-100">
            <h5 className="mb-3">Our Office</h5>
            <p><strong>Address:</strong> 123 Donation Street, Indore, India</p>
            <p><strong>Email:</strong> support@foodbridge.org</p>
            <p><strong>Phone:</strong> +91 9876543210</p>
            <img
              src="https://img.freepik.com/free-vector/contact-us-concept-landing-page_23-2148238435.jpg"
              alt="Contact"
              className="img-fluid mt-3 rounded"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
