/**
 * JWT Authentication & Role-Based Access Control (RBAC) Middleware
 * Enforces ownership and access permissions for Patient, Doctor, and Admin roles.
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'healthcare_jwt_secure_key_development_2026';

// Middleware to authenticate user from Bearer Token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access denied. Bearer token is missing.',
      statusCode: 401
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'The user belonging to this token no longer exists.',
        statusCode: 401
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token. Please log in again.',
      statusCode: 401
    });
  }
};

// Middleware to authorize specific user roles (RBAC)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Role '${req.user ? req.user.role : 'anonymous'}' is not authorized to access this resource. Required: [${roles.join(', ')}]`,
        statusCode: 403
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
