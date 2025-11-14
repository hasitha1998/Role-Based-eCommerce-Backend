import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import models from '../models/index.js';

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

const pgSession = connectPgSimple(session);

// Configure AdminJS
const adminOptions = {
  resources: [
    {
      resource: models.User,
      options: {
        properties: {
          password: {
            isVisible: false
          },
          createdAt: {
            isVisible: { list: true, filter: true, show: true, edit: false }
          },
          updatedAt: {
            isVisible: { list: false, filter: false, show: true, edit: false }
          }
        },
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
          },
          show: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
          },
          edit: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
          },
          delete: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
          },
          new: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
          }
        }
      }
    },
    {
      resource: models.Category,
      options: {
        properties: {
          createdAt: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          updatedAt: {
            isVisible: { list: false, filter: false, show: true, edit: false }
          }
        }
      }
    },
    {
      resource: models.Product,
      options: {
        properties: {
          categoryId: {
            isVisible: { list: true, filter: true, show: true, edit: true }
          },
          createdAt: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          updatedAt: {
            isVisible: { list: false, filter: false, show: true, edit: false }
          }
        }
      }
    },
    {
      resource: models.Order,
      options: {
        properties: {
          userId: {
            isVisible: { list: true, filter: true, show: true, edit: true }
          },
          createdAt: {
            isVisible: { list: true, filter: true, show: true, edit: false }
          },
          updatedAt: {
            isVisible: { list: false, filter: false, show: true, edit: false }
          }
        }
      }
    },
    {
      resource: models.OrderItem,
      options: {
        properties: {
          orderId: {
            isVisible: { list: true, filter: true, show: true, edit: true }
          },
          productId: {
            isVisible: { list: true, filter: true, show: true, edit: true }
          },
          createdAt: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          updatedAt: {
            isVisible: { list: false, filter: false, show: true, edit: false }
          }
        }
      }
    },
    {
      resource: models.Setting,
      options: {
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
          },
          show: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
          },
          edit: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
          },
          delete: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
          },
          new: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
          }
        }
      }
    }
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'eCommerce Admin',
    softwareBrothers: false,
  }
};

const admin = new AdminJS(adminOptions);

// Build authenticated AdminJS router
export const buildAdminRouter = (app) => {
  const sessionStore = new pgSession({
    conObject: {
      connectionString: process.env.DATABASE_URL
    },
    tableName: 'session',
    createTableIfMissing: true
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email, password) => {
        const User = models.User;
        const user = await User.findOne({ where: { email } });
        
        if (user && await user.validatePassword(password)) {
          return { ...user.toJSON(), role: user.role };
        }
        return null;
      },
      cookiePassword: process.env.ADMIN_JS_COOKIE_PASSWORD,
    },
    null,
    {
      store: sessionStore,
      resave: false,
      saveUninitialized: true,
      secret: process.env.ADMIN_JS_COOKIE_PASSWORD,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      },
      name: 'adminjs'
    }
  );

  app.use(admin.options.rootPath, adminRouter);
};

export default admin;