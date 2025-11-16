import models from '../models/index.js';

export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Use filter from RBAC middleware
    const whereClause = req.orderFilter || {};

    const { count, rows: orders } = await models.Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName']
        },
        {
          model: models.OrderItem,
          as: 'items',
          include: [
            {
              model: models.Product,
              as: 'product',
              attributes: ['id', 'name', 'images', 'price']
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await models.Order.findByPk(id, {
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName']
        },
        {
          model: models.OrderItem,
          as: 'items',
          include: [
            {
              model: models.Product,
              as: 'product',
              attributes: ['id', 'name', 'images', 'price']
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user can access this order
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item' });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await models.Product.findByPk(item.productId);

      if (!product) {
        return res.status(404).json({ 
          message: `Product with ID ${item.productId} not found` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(422).json({ 
          message: `Insufficient stock for product: ${product.name}` 
        });
      }

      const subtotal = parseFloat(product.price) * parseInt(item.quantity);
      totalAmount += subtotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });
    }

    // Create order
    const order = await models.Order.create({
      userId: req.user.id,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Create order items
    for (const item of orderItems) {
      await models.OrderItem.create({
        orderId: order.id,
        ...item
      });

      // Update product stock
      await models.Product.decrement('stock', {
        by: item.quantity,
        where: { id: item.productId }
      });
    }

    // Fetch complete order
    const newOrder = await models.Order.findByPk(order.id, {
      include: [
        {
          model: models.OrderItem,
          as: 'items',
          include: [
            {
              model: models.Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status',
        validStatuses 
      });
    }

    const order = await models.Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status });

    const updatedOrder = await models.Order.findByPk(id, {
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName']
        },
        {
          model: models.OrderItem,
          as: 'items',
          include: [
            {
              model: models.Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};