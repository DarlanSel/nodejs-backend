const { User } = require('../models');

const authorize = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json();

  return next();
};

module.exports = authorize;
