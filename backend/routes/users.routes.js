import express from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected + admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;