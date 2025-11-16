// backend/src/config/adminjs.js

import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import models from '../models/index.js';

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

const adminOptions = {
  resources: [
    { 
      resource: models.User, 
      options: { 
        properties: { 
          password: { isVisible: false } 
        } 
      } 
    },
    { resource: models.Category },
    { resource: models.Product },
    { resource: models.Order },
    { resource: models.OrderItem },
    { resource: models.Setting }
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'eCommerce Admin',
    softwareBrothers: false,
  }
};

const admin = new AdminJS(adminOptions);

export const buildAdminRouter = (app) => {
  // NO AUTHENTICATION - Direct access
  const adminRouter = AdminJSExpress.buildRouter(admin);
  
  app.use(admin.options.rootPath, adminRouter);
  console.log('✅ AdminJS configured at /admin (open access for demo)');
};

export default admin;