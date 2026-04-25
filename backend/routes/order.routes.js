import express from 'express';
import { 
  getOrders, 
  createOrder
} from '../controllers/orders.controller.js';
import { protect,authorize } from '../middleware/auth.middleware.js'; // Keep this for dashboard users

const router = express.Router();

/**
 * 1. DASHBOARD VIEW (Requires Login)
 * Only logged-in users with 'view' permission can see the list
 */
router.get('/', protect, authorize('orders', 'view'), getOrders);
/**
 * 2. PUBLIC/N8N SUBMISSION (No Authorization required)
 * This allows your n8n agent to post orders directly.
 */
router.post('/submit', createOrder);

export default router;