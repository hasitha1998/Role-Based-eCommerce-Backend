import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  requireAdmin, 
  requireAdminOrOwner,
  requirePermission,
  attachRbacHelpers 
} from '../middleware/rbac.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// Attach RBAC helpers to all routes
router.use(authenticateToken);
router.use(attachRbacHelpers);

// Admin only - view all users
router.get('/', 
  requirePermission('users', 'view'),
  getAllUsers
);

// Admin or owner - view specific user
router.get('/:id', 
  requireAdminOrOwner('id'),
  getUserById
);

// Admin or owner - update user
router.put('/:id', 
  requireAdminOrOwner('id'),
  updateUser
);

// Admin only - delete user
router.delete('/:id', 
  requireAdmin,
  deleteUser
);

export default router;