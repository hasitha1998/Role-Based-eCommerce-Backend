import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import models from './models/index.js';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import categoryRoutes from './routes/categories.js';
import { buildAdminRouter } from './config/adminjs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://hasitha1998-role-based-e-commerce-f.vercel.app',
    'https://role-based-ecommerce-backend-production.up.railway.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// AdminJS
buildAdminRouter(app);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database sync and server start
const startServer = async () => {
  try {
    await models.sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    await models.sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 AdminJS available at http://localhost:${PORT}/admin`);
      console.log(`🌍 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;