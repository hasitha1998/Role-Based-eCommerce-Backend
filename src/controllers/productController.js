import models from '../models/index.js';

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await models.Product.findAndCountAll({
      include: [
        {
          model: models.Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      products,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await models.Product.findByPk(id, {
      include: [
        {
          model: models.Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      comparePrice,
      costPrice,
      sku,
      stock,
      images,
      categoryId,
      isActive,
      isFeatured
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    // Check if SKU already exists
    if (sku) {
      const existingProduct = await models.Product.findOne({ where: { sku } });
      if (existingProduct) {
        return res.status(409).json({ message: 'SKU already exists' });
      }
    }

    const product = await models.Product.create({
      name,
      description,
      price,
      comparePrice,
      costPrice,
      sku,
      stock: stock || 0,
      images: images || [],
      categoryId,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false
    });

    const newProduct = await models.Product.findByPk(product.id, {
      include: [
        {
          model: models.Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await models.Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if SKU is being updated and if it already exists
    if (updateData.sku && updateData.sku !== product.sku) {
      const existingProduct = await models.Product.findOne({ 
        where: { sku: updateData.sku } 
      });
      if (existingProduct) {
        return res.status(409).json({ message: 'SKU already exists' });
      }
    }

    await product.update(updateData);

    const updatedProduct = await models.Product.findByPk(id, {
      include: [
        {
          model: models.Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await models.Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};