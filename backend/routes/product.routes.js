import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js';
import express from 'express';
const router = express.Router();
import { protect,authorize } from '../middleware/auth.middleware.js'; // Keep this for dashboard users

router.get('/', protect, authorize('products', 'view') ,getProducts);
router.post('/', protect, authorize('products', 'create'),  createProduct);
router.put('/:id', protect, authorize('products', 'update') , updateProduct);
router.delete('/:id', protect, authorize('products', 'delete'),  deleteProduct);


export default router;