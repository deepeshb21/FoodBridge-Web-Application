// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import path from 'path';
// import cookieParser from "cookie-parser";
// import userRoutes from './routes/userRoutes.js';
// import protectedRoutes from './routes/protectedRoutes.js'; 
// import donationRoutes from './routes/donationRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';
// import notificationRoutes from './routes/notificationRoutes.js';
// import ngoRoutes from './routes/ngoRoutes.js';




// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;
// app.use(cookieParser());
// app.use(express.json());

// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   })
// );


// const __dirname = path.resolve();
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


// app.use('/api/donations', donationRoutes);
// app.use("/api/admin", adminRoutes);
// app.use('/api/notifications', notificationRoutes);


// // DB connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch(err => console.error("❌ MongoDB connection error:", err));

// // Routes
// app.use('/api/users', userRoutes); // register, login
// app.use('/api', protectedRoutes);  // /api/private
// app.use('/api/ngos', ngoRoutes);


// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });




//-----------------------------------------------------------------------------------------------



import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import cookieParser from "cookie-parser";

import userRoutes from './routes/userRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js'; 
import donationRoutes from './routes/donationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import ngoRoutes from './routes/ngoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parse form data

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Serve uploaded images
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes); // register, login, profile
app.use('/api', protectedRoutes);  // /api/private
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ngos', ngoRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Handle unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
