// routes/roleRoutes.js
import express from 'express';
const router = express.Router();
import { getAllRoles, createRoles, updateRole , deleteRole  } from '../controllers/roles.controller.js';

// Define Routes and map them to Controller functions

// @route   /api/roles
router.get('/', getAllRoles);
router.post('/', createRoles);

// @route   /api/roles/:id
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);


export default router;  