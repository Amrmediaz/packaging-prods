import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middleware/auth.middleware.js';

// This endpoint serves your static data but ONLY if authorized

router.use(protect);
router.get('/stats', authorize('dashboard', 'view'), (req, res) => {
  res.json({
    success: true,
    data: [
      { title: 'Total Revenue', value: 'RO 12,450', change: '+12%', icon: '💰' },
      { title: 'Active Projects', value: '84', change: '+5%', icon: '📦' },
      { title: 'Total Clients', value: '1,024', change: '+18%', icon: '👥' },
    ]
  });
});

export default router;