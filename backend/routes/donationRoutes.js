
import express from "express";
import {
  createDonation,
  getAllDonations,
  getMyDonations,
  updateDonationStatus,
  cancelDonation,
  getDonorStats,
  getReceivedDonations 
} from "../controllers/donationController.js";
import { adminUpdateDonationStatus } from '../controllers/donationController.js';
import adminOnly from '../middleware/adminMiddleware.js';



import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDonation);

router.get("/", protect, getAllDonations);

router.get("/my", protect, getMyDonations);

router.get("/stats", protect, getDonorStats);

router.get("/received", protect, getReceivedDonations);

router.put("/:id/status", protect, updateDonationStatus);

router.delete("/:id", protect, cancelDonation);

router.put(
  '/:id/admin-status',protect,adminOnly,adminUpdateDonationStatus
);

export default router;
