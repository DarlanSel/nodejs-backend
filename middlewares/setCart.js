const { Cart } = require('../models');

const setCart = async (req, res, next) => {
  let cart = await req.user.getCurrentCart();

  if (!cart) cart = await Cart.create({ userId: req.user.id });

  req.cart = cart;

  return next();
};

module.exports = setCart;
