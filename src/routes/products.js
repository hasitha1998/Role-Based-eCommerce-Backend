import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  requirePermission,
  attachRbacHelpers 
} from '../middleware/rbac.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.use(authenticateToken);
router.use(attachRbacHelpers);

// Anyone can view products
router.get('/', 
  requirePermission('products', 'view'),
  getAllProducts
);

router.get('/:id', 
  requirePermission('products', 'view'),
  getProductById
);

// Admin only for modifications
router.post('/', 
  requirePermission('products', 'create'),
  createProduct
);

router.put('/:id', 
  requirePermission('products', 'update'),
  updateProduct
);

router.delete('/:id', 
  requirePermission('products', 'delete'),
  deleteProduct
);

export default router;