const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (featured === 'true') filter.featured = true;
    const products = await Product.find(filter).sort({ featured: -1, createdAt: -1 }).limit(100);
    res.json(products);
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) { next(error); }
});

module.exports = router;
