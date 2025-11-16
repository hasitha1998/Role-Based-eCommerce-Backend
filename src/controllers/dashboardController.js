import models from '../models/index.js';
import { Op } from 'sequelize';

export const getDashboardStats = async (req, res) => {
  try {
    const [usersCount, ordersCount, productsCount, revenueResult] = await Promise.all([
      models.User.count(),
      models.Order.count(),
      models.Product.count(),
      models.Order.sum('totalAmount', {
        where: {
          paymentStatus: 'paid'
        }
      })
    ]);

    res.json({
      users: usersCount,
      orders: ordersCount,
      products: productsCount,
      revenue: revenueResult || 0
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};