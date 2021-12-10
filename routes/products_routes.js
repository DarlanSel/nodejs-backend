const express = require('express');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
var router = express.Router();


const { Product } = require('../models');

// List All Products
router.get('/', async (req, res, next) => {
  return res.json(await Product.findAll());
});

// Select one Product
router.get('/:id', async (req, res) => {
  let product = await Product.findByPk(req.params.id)

  if (!product) return res.status(404).json({ message: 'Product not found.' })

  return res.json(product);
});

// Create a Product
router.post('/', authenticate, authorize, async (req, res) => {
  try {
    let product = await Product.create(req.body);
    return res.json(product);
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
});

// Update a Product
router.put('/:id', authenticate, authorize, async (req, res) => {
  const { name, email } = req.body;

  let product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' })

  try {
    await product.update({ name, email });
    return res.json(product);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

// Destroy a Product
router.delete('/:id', authenticate, authorize, async (req, res) => {
  let product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' })

  try {
    await product.destroy();
    return res.json(product);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

module.exports = router;
