import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  filterOrdersByRole,
  requirePermission,
  requireAdmin,
  attachRbacHelpers 
} from '../middleware/rbac.js';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

router.use(authenticateToken);
router.use(attachRbacHelpers);

// Get orders (filtered by role)
router.get('/', 
  filterOrdersByRole,
  requirePermission('orders', 'view'),
  getAllOrders
);

// Get single order
router.get('/:id', 
  requirePermission('orders', 'view'),
  getOrderById
);

// Create order
router.post('/', 
  requirePermission('orders', 'create'),
  createOrder
);

// Update order status (admin only)
router.put('/:id/status', 
  requireAdmin,
  updateOrderStatus
);

export default router;