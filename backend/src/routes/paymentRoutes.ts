import { Router } from 'express';
import { processPayment } from '../controllers/paymentController';

const router = Router();

router.post('/process', processPayment);

export default router;
