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


router.get('/',    authorize('users', 'view'),   getUsers);
router.post('/',   authorize('users', 'create'), createUser);
router.delete('/:id', authorize('users', 'delete'), deleteUser);
router.put('/:id', authorize('users', 'edit'), updateUser);

export default router;