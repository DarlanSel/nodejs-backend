const express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();

const { Cart } = require('../models');
const { User } = require('../models');

// List All Carts
router.get('/', async (req, res) => {
  var carts;

  if (req.query.userId) {
    carts = await Cart.findAll({ where: { userId: req.query.userId } });
  } else {
    carts = await Cart.findAll();
  }

  return res.json(carts);
});


// Find Cart
router.get('/:id', async (req, res) => {
  let cart = await Cart.findByPk(req.params.id)

  if (!cart) return res.status(404).json({ message: 'Cart not found.' })

  return res.json({ cart, items: await cart.getCartItems() });
});

module.exports = router;
