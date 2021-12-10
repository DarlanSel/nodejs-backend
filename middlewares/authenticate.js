const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(403).json();

  jwt.verify(authorization, process.env.JWT_SECRET_KEY, async (err, payload) => {
    req.user = await User.findByPk(payload.user.id);

    return (err || !req.user) ? res.status(403).json(err) : next();
  });
};

module.exports = authenticate;
