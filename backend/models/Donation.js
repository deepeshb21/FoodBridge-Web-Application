import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodDetails: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    pickupTime: {
      type: String,
    },
    review: {
      type: String,
    },
    notes: {
      type: String,
    },
    donationType: {
      type: String,
      enum: ["Cooked", "Raw", "Packaged", "Other"],
      default: "Cooked",
    },
    foodCategory: {
      type: String,
      enum: ["Fruits", "Vegetables", "Bakery", "Dairy", "Grains", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "picked" ,"rejected", "completed"],
      default: "pending",
    },
    statusHistory: [
      {
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: String,
        newStatus: String,
        timestamp: Date,
        note: String,
      }
    ]
  },
  { timestamps: true } 
);

const Donation = mongoose.models.Donation || mongoose.model("Donation", donationSchema);

export default Donation;

