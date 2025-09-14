import express from 'express';
import { getVerifiedNGOs } from '../controllers/ngoController.js';
const router = express.Router();

router.get('/verified', getVerifiedNGOs);

export default router;
