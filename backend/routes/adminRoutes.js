import express from 'express';
import adminOnly from '../middleware/adminMiddleware.js';
import User from '../models/userModel.js';
import Donation from '../models/Donation.js'; 
import { getNgosByStatus } from '../controllers/userController.js'; 

const router = express.Router();

router.get('/all-ngos', adminOnly, async (req, res) => {
  try {
    const ngos = await User.find({ role: 'ngo' });
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching NGOs', error: err.message });
  }
});

router.put('/verify-ngo/:id', adminOnly, async (req, res) => {
  try {
    const ngo = await User.findById(req.params.id);
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });

    ngo.isVerified = !ngo.isVerified;
    await ngo.save();

    res.json({ message: 'Verification status updated', ngo });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
});

router.get('/analytics/overview', adminOnly, async (req, res) => {
  try {
    const [
      totalUsers,
      totalNGOs,
      verifiedNGOs,
      blockedUsers,
      totalDonors,
      totalDonations,
      donationsByStatus,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'ngo' }),
      User.countDocuments({ role: 'ngo', isVerified: true }),
      User.countDocuments({ isBlocked: true }),
      User.countDocuments({ role: 'donor' }),
      Donation.countDocuments({}),
      Donation.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { status: '$_id', count: 1, _id: 0 } },
      ]),
    ]);

    res.json({
      totalUsers,
      totalDonors,
      totalNGOs,
      verifiedNGOs,
      blockedUsers,
      totalDonations,
      donationsByStatus,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load overview', error: err.message });
  }
});

router.get('/analytics/trends', adminOnly, async (req, res) => {
  try {
    const days = Number(req.query.days || 14);
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days + 1);

    const data = await Donation.aggregate([
      { $match: { createdAt: { $gte: fromDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $project: { date: '$_id', count: 1, _id: 0 } },
      { $sort: { date: 1 } },
    ]);

    res.json({ days, from: fromDate, data });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load trends', error: err.message });
  }
});

router.get('/ngos/:status', adminOnly, getNgosByStatus);

export default router;

