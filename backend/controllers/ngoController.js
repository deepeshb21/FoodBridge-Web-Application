import User from '../models/User.js';

export const getVerifiedNGOs = async (req, res) => {
  try {
    const ngos = await User.find({ role: 'ngo', isVerified: true }).select('name _id');
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
