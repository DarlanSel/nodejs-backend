const express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();

const { CartItem } = require('../models');
const { Product } = require('../models');

async function updateCartPrice(cart) {
  var price = 0;

  await cart.getCartItems().then((items) => {
    items.forEach(item => price += item.quantity * item.price);
  });

  await cart.update({ total_price: price });
}

// Get Current Cart
router.get('/', async (req, res) => {
  return res.json({ cart: req.cart, items: await req.cart.getCartItems() });
});

// Add Item To Cart
router.post('/items', async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) return res.status(400).json({ message: 'Ivalid quantity.' })

  let product = await Product.findByPk(productId);
  if (!product) return res.status(400).json({ message: 'Invalid product.' })

  let item = await CartItem.findOne({ where: { cartId: req.cart.id, productId, price: product.price } });
  try {

    if (item) {
      var newQuantity = quantity + item.quantity;
      await item.update({ quantity: newQuantity });
    } else {
      await CartItem.create({ cartId: req.cart.id, productId, quantity, price: product.price });
    }

    await updateCartPrice(req.cart);

    return res.json({ cart: req.cart, items: await req.cart.getCartItems() });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
});

// Remove Item From Cart
router.delete('/items/:id', async (req, res) => {
  const { quantity } = req.body;

  let item = await CartItem.findOne({ where: { id: req.params.id, cartId: req.cart.id } });
  if (!item) return res.status(400).json({ message: 'Invalid item.' });

  if (quantity < -1) return res.status(400).json({ message: 'Invalid quantity.' });

  try {
    var newQuantity = item.quantity - quantity;
    if (quantity == -1 || newQuantity < 1) {
      await item.destroy();
    } else {
      await item.update({ quantity: newQuantity });
    }

    await updateCartPrice(req.cart);

    return res.json({ cart: req.cart, items: await req.cart.getCartItems() });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
});

// Pay Cart
router.put('/pay', async (req, res) => {
  if (req.cart.total_price == 0.0) return res.status(400).json({ message: 'Nothing to be paid.' });

  try {
    await req.cart.update({ paid: Date.now() });
    res.json({ cart: req.cart, items: await req.cart.getCartItems() })
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
});


module.exports = router;
