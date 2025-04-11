const User = require('../models/UserModel.js');
const Log = require('../models/LogModel.js');

async function requireAuth(req, res, next) {
  const user = await User.findById(req.session.user);
  const email = user?.email || "unknown";
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];

  if (!req.session.user) {
    await Log.create({
      email,
      status: 'failure',
      message: 'User is not Aunthenticated',
      ip,
      userAgent
    });
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

function requireRole(role) {
  return async (req, res, next) => {
    const roles = await User.findById(req.session.user).select('role');
    const user = await User.findById(req.session.user);
    const email = user?.email || "unknown";
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    if (!req.session.user || roles.role !== role) {
      await Log.create({
          email,
          status: 'failure',
          message: 'Unauthorized User',
          ip,
          userAgent
      });
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};