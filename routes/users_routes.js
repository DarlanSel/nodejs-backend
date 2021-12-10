const express = require('express');
const jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
var router = express.Router();

const { User } = require('../models');

function authorizeUser(user, ids = []) {
  if (user.isAdmin || ids.includes(user.id)) return true;

  return false;
}

// List All Users
router.get('/', authenticate, authorize, async (req, res) => {
  return res.json(await User.findAll());
});


// Find User
router.get('/:id', authenticate, async (req, res) => {
  if (!authorizeUser(req.user, [parseInt(req.params.id)])) return res.status(403).json();

  let user = await User.findByPk(req.params.id);

  if (!user) return res.status(404).json({ message: 'User not found.' });

  return res.json(user);
});


// Create User
router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  try {
    let user = await User.create({ email, senha });
    return res.json(user);
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
});

// Update User
router.put('/:id', authenticate, async (req, res) => {
  if (!authorizeUser(req.user, [parseInt(req.params.id)])) return res.status(403).json();

  const { name, email } = req.body;

  let user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  try {
    await user.update({ name, email });
    return res.json(user);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

// Destroy User
router.delete('/:id', authenticate, async (req, res) => {
  if (!authorizeUser(req.user, [parseInt(req.params.id)])) return res.status(403).json();

  let user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  try {
    await user.destroy();
    return res.json(user);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

// Authenticate User
function generateJwtToken(payload = {}, timeout) {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: timeout });
}

router.post('/authenticate', async (req, res) => {
  const { 'token-timeout': timeout = 86400 } = req.headers;
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email, password } });

  if(!user) return res.status(400).json({ message: "Wrong e-mail or password." });

  const now = new Date();
  var payload = {
    user,
    loggedIn: now,
    expiresIn: new Date(now.getTime() + timeout * 1000)
  };

  return res.json({
    token: generateJwtToken(payload, timeout),
    payload: payload
  });
});

module.exports = router;
