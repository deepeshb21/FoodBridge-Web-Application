
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    type: {
      type: String,
      enum: ['donation', 'ngo', 'system', 'alert'], 
      default: 'system',
    },
    message: {
      type: String,
      trim: true, 
      required: [true, 'Notification message is required'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    }
  },
  { 
    timestamps: true 
  }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
