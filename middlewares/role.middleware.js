'use strict';

/**
 * Middleware factory that restricts access to users with specific roles.
 * Usage: router.post('/admin-only', verifyToken, requireRole('admin'), handler)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Acces refuse. Role insuffisant.',
      });
    }
    return next();
  };
}

module.exports = { requireRole };
