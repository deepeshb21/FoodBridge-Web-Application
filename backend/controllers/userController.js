import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Notification from '../models/notificationModel.js';
import asyncHandler from 'express-async-handler';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};


export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, userType, address, licenseId } = req.body;

  if (userType === 'ngo' && (!address || !licenseId)) {
    return res.status(400).json({ message: 'NGO must provide address and license ID' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: userType,
    address,
    licenseId,
    isVerified: userType === 'ngo' ? false : true, 
  });

  await newUser.save();

  if (userType === 'ngo') {
    const admins = await User.find({ role: 'admin' }).select('_id');
    if (admins.length > 0) {
      const notifications = admins.map(admin => ({
        user: admin._id,
        type: 'ngo',
        message: `New NGO registration: ${name} is awaiting verification.`,
      }));
      await Notification.insertMany(notifications);
    }
  }

  const token = generateToken(newUser);

  res.status(201).json({
    message: 'Registration successful',
    token,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || '',
      address: newUser.address || '',
      gender: newUser.gender || '',
      dob: newUser.dob || '',
      profilePic: newUser.image || '/default-avatar.png',
      userType: newUser.role,
      isVerified: newUser.isVerified,
      isBlocked: newUser.isBlocked,
    },
  });
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.isBlocked) return res.status(403).json({ message: 'Your account has been blocked by the Admin' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user);

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      gender: user.gender || '',
      dob: user.dob || '',
      profilePic: user.image || '/default-avatar.png',
      userType: user.role,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
    },
  });
});


export const getAllNgos = asyncHandler(async (req, res) => {
  const { isVerified } = req.query;
  const filter = { role: 'ngo' };
  if (isVerified === 'true') filter.isVerified = true;
  if (isVerified === 'false') filter.isVerified = false;

  const ngos = await User.find(filter).select('-password');
  res.status(200).json(ngos);
});

export const getUnverifiedNgos = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

  const ngos = await User.find({ role: 'ngo', isVerified: false }).select('-password');
  res.status(200).json(ngos);
});

export const verifyNgo = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

  const { id } = req.params;
  const ngo = await User.findById(id);
  if (!ngo || ngo.role !== 'ngo') return res.status(404).json({ message: 'NGO not found' });

  ngo.isVerified = true;
  await ngo.save();

  await Notification.create({
    user: ngo._id,
    type: 'system',
    message: 'Your NGO account has been verified by the admin. You can now start receiving donations.',
  });

  res.status(200).json({ message: 'NGO verified successfully', ngo });
});

export const getNgosByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const isVerified = status === 'approved';
  const ngos = await User.find({ role: 'ngo', isVerified }).select('-password');
  res.status(200).json(ngos);
});

export const getNgoStats = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

  const [total, verified, unverified] = await Promise.all([
    User.countDocuments({ role: 'ngo' }),
    User.countDocuments({ role: 'ngo', isVerified: true }),
    User.countDocuments({ role: 'ngo', isVerified: false }),
  ]);

  res.status(200).json({
    totalNGOs: total,
    verifiedNGOs: verified,
    unverifiedNGOs: unverified,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.address = req.body.address || user.address;
  user.gender = req.body.gender || user.gender;
  user.dob = req.body.dob || user.dob;

  if (req.file && req.file.path) {
    user.image = req.file.path; 
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    address: updatedUser.address,
    gender: updatedUser.gender,
    dob: updatedUser.dob,
    profilePic: updatedUser.image || '/default-avatar.png',
    userType: updatedUser.role,
    isVerified: updatedUser.isVerified,
    isBlocked: updatedUser.isBlocked,
  });
});


export const getVerifiedNGOs = asyncHandler(async (req, res) => {
  const ngos = await User.find({ role: 'ngo', isVerified: true }).select('name _id');
  res.status(200).json(ngos);
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found.' });

  res.json({
    message: 'Profile fetched successfully',
    user,
  });
});
