import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, sku, category, unit, price, stock, description } = req.body;

    const newProduct = new Product({
      name,
      sku,
      category: category || 'Packaging',
      unit: unit || 'pcs',
      price: Number(price),
      stock: Number(stock),
      description: description || '',
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Product Creation Error:', error);

    // Handle duplicate SKU error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `SKU "${error.keyValue?.sku}" already exists`,
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, category, unit, price, stock, description } = req.body;

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name,
        sku,
        category,
        unit,
        price: Number(price),
        stock: Number(stock),
        description,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updated,
    });
  } catch (error) {
    console.error('Product Update Error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `SKU "${error.keyValue?.sku}" already exists`,
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Product Delete Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};