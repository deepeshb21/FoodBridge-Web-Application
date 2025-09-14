import Donation from '../models/Donation.js';
import User from '../models/User.js';
import Notification from '../models/notificationModel.js';


export const createDonation = async (req, res) => {
  try {
    const {
      ngoId,
      foodDetails,
      quantity,
      pickupAddress,
      pickupTime,
      notes,
      donationType,
      foodCategory
    } = req.body;

    const donorId = req.user.id;

    if (!ngoId || !foodDetails || !quantity || !pickupAddress) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const ngo = await User.findById(ngoId);
    if (!ngo || ngo.role !== 'ngo') {
      return res.status(404).json({ message: 'NGO not found' });
    }

    if (!ngo.isVerified) {
      return res.status(403).json({ message: 'This NGO is not verified yet' });
    }

    const newDonation = new Donation({
      donorId,
      ngoId,
      foodDetails,
      quantity,
      pickupAddress,
      pickupTime,
      notes,
      donationType,
      foodCategory
    });

    await newDonation.save();

    await Notification.create({
      user: ngo._id,
      type: 'donation',
      message: `New donation request from ${req.user.name || 'a donor'}`
    });

    res.status(201).json({
      message: 'Donation request submitted successfully',
      donation: newDonation
    });

  } catch (error) {
    console.error('Donation creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllDonations = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const donations = await Donation.find()
      .populate('donorId', 'name email')
      .populate('ngoId', 'name');

    res.json({ success: true, donations });
  } catch (error) {
    console.error('Error in getAllDonations:', error);
    next(error);
  }
};


export const getMyDonations = async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: 'Only donors can view their donations' });
    }

    const myDonations = await Donation.find({ donorId: req.user.id }).populate('ngoId', 'name');
    res.status(200).json(myDonations);
  } catch (error) {
    console.error("Error fetching my donations:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateDonationStatus = async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can update donation status' });
    }

    const { id } = req.params;
    const { status, reason } = req.body;
    const validStatuses = ['pending', 'accepted', 'rejected', 'picked', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    let donation = await Donation.findOne({ _id: id, ngoId: req.user.id });
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found or unauthorized' });
    }

    const oldStatus = donation.status;
    donation.status = status;
    donation.statusHistory = donation.statusHistory || [];
    donation.statusHistory.push({
      updatedBy: req.user._id,
      role: req.user.role,
      newStatus: status,
      timestamp: new Date(),
      note: reason || ''
    });

    await donation.save();

    if (status === 'rejected') {
      const availableNgo = await User.findOne({
        _id: { $ne: req.user.id }, 
        role: 'ngo',
        isVerified: true
      });

      if (availableNgo) {
        donation.ngoId = availableNgo._id;
        donation.status = 'pending';
        await donation.save();

        await Notification.create({
          user: availableNgo._id,
          type: 'donation',
          message: `A donation has been reassigned to you: ${donation.foodDetails}`
        });

        await Notification.create({
          user: donation.donorId,
          type: 'donation',
          message: `Your donation was reassigned to another NGO (${availableNgo.name})`
        });
      }
    } else if (oldStatus !== status) {
      await Notification.create({
        user: donation.donorId,
        type: 'donation',
        message: `Your donation for "${donation.foodDetails}" is now ${status}`
      });

      await Notification.create({
        user: donation.ngoId,
        type: 'donation',
        message: `Donation status for "${donation.foodDetails}" updated to ${status}`
      });
    }

    res.status(200).json({ message: 'Donation status updated', donation });
  } catch (error) {
    console.error('Error updating donation status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const cancelDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this donation" });
    }

    await donation.deleteOne();
    res.status(200).json({ message: "Donation cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getDonorStats = async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const donorId = req.user.id;
    const totals = await Donation.countDocuments({ donorId });
    const pending = await Donation.countDocuments({ donorId, status: 'pending' });
    const accepted = await Donation.countDocuments({ donorId, status: 'accepted' });
    const rejected = await Donation.countDocuments({ donorId, status: 'rejected' });
    const completed = await Donation.countDocuments({ donorId, status: 'completed' });

    const recentDonations = await Donation.find({ donorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('ngoId', 'name');

    res.status(200).json({ totals, pending, accepted, rejected, completed, recentDonations });
  } catch (error) {
    console.error("Error getting donor stats:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getReceivedDonations = async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const donations = await Donation.find({ ngoId: req.user.id }).populate('donorId', 'name');
    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching received donations:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const adminUpdateDonationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['pending', 'accepted', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const donation = await Donation.findById(id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    const oldStatus = donation.status;
    donation.status = status;
    donation.adminNote = note || '';
    donation.statusHistory = donation.statusHistory || [];
    donation.statusHistory.push({
      updatedBy: req.user._id,
      role: req.user.role,
      newStatus: status,
      timestamp: new Date(),
      note,
    });

    await donation.save();

    if (oldStatus !== status) {
      await Notification.create({
        user: donation.donorId,
        type: 'donation',
        message: `Your donation for "${donation.foodDetails}" is now ${status}`
      });

      await Notification.create({
        user: donation.ngoId,
        type: 'donation',
        message: `Donation from donor updated to ${status} by Admin`
      });
    }

    res.status(200).json({ message: 'Donation status updated by admin', donation });
  } catch (error) {
    console.error('Admin update donation error:', error);
    next(error);
  }
};
