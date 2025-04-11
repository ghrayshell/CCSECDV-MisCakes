const User = require('../models/UserModel.js');

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

function requireRole(role) {
  return async (req, res, next) => {
    const user = await User.findById(req.session.user).select('role');

    if (!req.session.user || user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};