import React from 'react';

const JoinNgo = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Join as NGO or Volunteer</h2>

      <form className="shadow p-4 bg-light rounded">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" placeholder="Your full name" />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" placeholder="example@email.com" />
        </div>

        <div className="mb-3">
          <label className="form-label">Contact Number</label>
          <input type="tel" className="form-control" placeholder="+91-XXXXXXXXXX" />
        </div>

        <div className="mb-3">
          <label className="form-label">Why do you want to join?</label>
          <textarea className="form-control" rows="3" placeholder="Share your reason"></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-100">Submit Request</button>
      </form>
    </div>
  );
};

export default JoinNgo;
