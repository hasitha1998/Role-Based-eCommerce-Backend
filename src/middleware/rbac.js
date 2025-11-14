/**
 * Role-Based Access Control (RBAC) Middleware
 * Handles authorization based on user roles and permissions
 */

import User from '../models/User.js';

/**
 * User Roles
 */
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

/**
 * Resource Permissions
 * Defines which roles can perform which actions on which resources
 */
export const PERMISSIONS = {
  // User management
  users: {
    view: [ROLES.ADMIN],
    create: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN]
  },
  
  // Product management
  products: {
    view: [ROLES.ADMIN, ROLES.USER],
    create: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN]
  },
  
  // Category management
  categories: {
    view: [ROLES.ADMIN, ROLES.USER],
    create: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN]
  },
  
  // Order management
  orders: {
    view: [ROLES.ADMIN, ROLES.USER],
    create: [ROLES.ADMIN, ROLES.USER],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
    viewAll: [ROLES.ADMIN], // Admin can view all orders
    viewOwn: [ROLES.USER]   // Users can only view their own orders
  },
  
  // Settings management
  settings: {
    view: [ROLES.ADMIN],
    create: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN]
  },
  
  // Dashboard
  dashboard: {
    viewFull: [ROLES.ADMIN],    // Full analytics
    viewLimited: [ROLES.USER]    // Personal stats only
  }
};

/**
 * Check if user has required role
 * @param {Object} user - User object from req.user
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 * @returns {boolean}
 */
export const hasRole = (user, allowedRoles) => {
  if (!user || !user.role) return false;
  
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user.role);
};

/**
 * Check if user has permission for a resource action
 * @param {Object} user - User object from req.user
 * @param {string} resource - Resource name (e.g., 'users', 'products')
 * @param {string} action - Action name (e.g., 'view', 'create', 'update', 'delete')
 * @returns {boolean}
 */
export const hasPermission = (user, resource, action) => {
  if (!user || !user.role) return false;
  
  const resourcePermissions = PERMISSIONS[resource];
  if (!resourcePermissions) return false;
  
  const actionPermissions = resourcePermissions[action];
  if (!actionPermissions) return false;
  
  return actionPermissions.includes(user.role);
};

/**
 * Middleware: Require specific role(s)
 * @param {string|string[]} allowedRoles - Role(s) required to access the route
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required' 
      });
    }

    if (!hasRole(req.user, allowedRoles)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware: Require Admin role
 * Shorthand for requireRole(ROLES.ADMIN)
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required' 
    });
  }

  if (req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ 
      message: 'Admin access required',
      current: req.user.role
    });
  }

  next();
};

/**
 * Middleware: Require User role (or higher)
 */
export const requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required' 
    });
  }

  if (![ROLES.ADMIN, ROLES.USER].includes(req.user.role)) {
    return res.status(403).json({ 
      message: 'User access required',
      current: req.user.role
    });
  }

  next();
};

/**
 * Middleware: Require permission for resource action
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 */
export const requirePermission = (resource, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required' 
      });
    }

    if (!hasPermission(req.user, resource, action)) {
      return res.status(403).json({ 
        message: `Permission denied: Cannot ${action} ${resource}`,
        required: PERMISSIONS[resource]?.[action] || [],
        current: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware: Require admin or resource owner
 * Useful for routes where users can only access their own data
 * @param {string} userIdParam - Parameter name containing the user ID (e.g., 'userId', 'id')
 */
export const requireAdminOrOwner = (userIdParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required' 
      });
    }

    // Admin can access everything
    if (req.user.role === ROLES.ADMIN) {
      return next();
    }

    // Check if user is accessing their own resource
    const resourceUserId = req.params[userIdParam] || req.body[userIdParam];
    
    if (resourceUserId && resourceUserId === req.user.id) {
      return next();
    }

    return res.status(403).json({ 
      message: 'Access denied. You can only access your own resources.',
      userId: req.user.id,
      requestedResource: resourceUserId
    });
  };
};

/**
 * Middleware: Filter orders based on role
 * Admin sees all orders, users see only their own
 */
export const filterOrdersByRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required' 
    });
  }

  // If not admin, restrict to own orders only
  if (req.user.role !== ROLES.ADMIN) {
    req.orderFilter = { userId: req.user.id };
  } else {
    req.orderFilter = {}; // Admin sees all
  }

  next();
};

/**
 * Middleware: Check if user is active
 */
export const requireActiveUser = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required' 
    });
  }

  try {
    // Refresh user from database to get latest status
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        message: 'Account is inactive. Please contact support.' 
      });
    }

    next();
  } catch (error) {
    console.error('Error checking user status:', error);
    return res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

/**
 * Utility: Get allowed resources for a role
 * @param {string} role - User role
 * @returns {Object} Object with resources and their allowed actions
 */
export const getAllowedResources = (role) => {
  const allowed = {};

  for (const [resource, actions] of Object.entries(PERMISSIONS)) {
    allowed[resource] = [];
    
    for (const [action, allowedRoles] of Object.entries(actions)) {
      if (allowedRoles.includes(role)) {
        allowed[resource].push(action);
      }
    }
  }

  return allowed;
};

/**
 * Utility: Check multiple permissions at once
 * @param {Object} user - User object
 * @param {Array} checks - Array of {resource, action} objects
 * @returns {boolean} True if user has ALL permissions
 */
export const hasAllPermissions = (user, checks) => {
  return checks.every(({ resource, action }) => 
    hasPermission(user, resource, action)
  );
};

/**
 * Utility: Check if user has any of the specified permissions
 * @param {Object} user - User object
 * @param {Array} checks - Array of {resource, action} objects
 * @returns {boolean} True if user has ANY permission
 */
export const hasAnyPermission = (user, checks) => {
  return checks.some(({ resource, action }) => 
    hasPermission(user, resource, action)
  );
};

/**
 * Express middleware to add RBAC utilities to req object
 */
export const attachRbacHelpers = (req, res, next) => {
  if (req.user) {
    req.rbac = {
      hasRole: (roles) => hasRole(req.user, roles),
      hasPermission: (resource, action) => hasPermission(req.user, resource, action),
      hasAllPermissions: (checks) => hasAllPermissions(req.user, checks),
      hasAnyPermission: (checks) => hasAnyPermission(req.user, checks),
      getAllowedResources: () => getAllowedResources(req.user.role),
      isAdmin: req.user.role === ROLES.ADMIN,
      isUser: req.user.role === ROLES.USER
    };
  }
  
  next();
};

export default {
  ROLES,
  PERMISSIONS,
  hasRole,
  hasPermission,
  requireRole,
  requireAdmin,
  requireUser,
  requirePermission,
  requireAdminOrOwner,
  filterOrdersByRole,
  requireActiveUser,
  getAllowedResources,
  hasAllPermissions,
  hasAnyPermission,
  attachRbacHelpers
};