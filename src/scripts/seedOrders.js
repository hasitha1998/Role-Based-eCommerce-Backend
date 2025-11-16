// backend/src/scripts/seedOrders.js

import models from '../models/index.js';

async function seedOrders() {
  try {
    await models.sequelize.authenticate();
    console.log('✅ Connected to database');

    // Check if orders already exist
    const existingOrders = await models.Order.findAll();
    if (existingOrders.length > 0) {
      console.log('⚠️  Orders already exist!');
      process.exit(0);
    }

    // Get users and products
    const users = await models.User.findAll();
    const products = await models.Product.findAll();

    if (users.length === 0) {
      console.log('❌ No users found. Please create users first.');
      process.exit(1);
    }

    if (products.length === 0) {
      console.log('❌ No products found. Please create products first.');
      process.exit(1);
    }

    console.log(`Found ${users.length} users and ${products.length} products`);

    // Create orders
    const orders = [];
    
    for (let i = 0; i < Math.min(5, users.length); i++) {
      const user = users[i];
      const orderNumber = `ORD-${Date.now()}-${i + 1}`;
      
      // Random number of products (2-4)
      const numProducts = Math.floor(Math.random() * 3) + 2;
      const selectedProducts = [];
      
      for (let j = 0; j < numProducts && j < products.length; j++) {
        selectedProducts.push(products[j]);
      }

      // Calculate total
      let totalAmount = 0;
      selectedProducts.forEach(product => {
        const quantity = Math.floor(Math.random() * 3) + 1;
        totalAmount += parseFloat(product.price) * quantity;
      });

      // Create order
      const order = await models.Order.create({
        orderNumber,
        userId: user.id,
        status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
        totalAmount: totalAmount.toFixed(2),
        paymentMethod: ['credit_card', 'paypal', 'cash_on_delivery'][Math.floor(Math.random() * 3)],
        paymentStatus: ['pending', 'paid', 'failed'][Math.floor(Math.random() * 3)],
        shippingAddress: {
          street: `${Math.floor(Math.random() * 1000)} Main St`,
          city: 'Colombo',
          state: 'Western Province',
          zipCode: '00100',
          country: 'Sri Lanka'
        },
        billingAddress: {
          street: `${Math.floor(Math.random() * 1000)} Main St`,
          city: 'Colombo',
          state: 'Western Province',
          zipCode: '00100',
          country: 'Sri Lanka'
        },
        notes: `Order from ${user.email}`
      });

      // Create order items
      for (const product of selectedProducts) {
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = parseFloat(product.price);
        const subtotal = price * quantity;

        await models.OrderItem.create({
          orderId: order.id,
          productId: product.id,
          quantity,
          price: price.toFixed(2),
          subtotal: subtotal.toFixed(2)
        });
      }

      orders.push(order);
      console.log(`✅ Created order ${orderNumber} for ${user.email} with ${selectedProducts.length} items`);
    }

    console.log(`\n✅ Successfully created ${orders.length} orders with their items!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedOrders();