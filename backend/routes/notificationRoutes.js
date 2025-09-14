
import express from 'express';
import {
  createNotification,
  getAllNotifications,
  markAsRead,
  deleteNotification,
  markAllAsRead
} from '../controllers/notificationController.js';

const router = express.Router();


router.post('/', createNotification);


router.put('/mark-read/:userId', markAllAsRead);

router.put('/:id/read', markAsRead);


router.delete('/:id', deleteNotification);


router.get('/:userId', getAllNotifications);

export default router;
