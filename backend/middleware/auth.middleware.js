import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - No token',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ populate role here so req.user.role is the full role object
    const user = await User.findById(decoded.id).populate('role');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    req.user = user; // ✅ req.user.role is now the full role object
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized - Invalid token',
    });
  }
};

// ✅ No Role import needed — role is already populated on req.user
export const authorize = (module, action) => {
  return (req, res, next) => {
    try {
      const roleData = req.user.role; // ✅ already populated, no extra DB query

      if (!roleData) {
        return res.status(403).json({
          success: false,
          message: 'Role not found',
        });
      }

      // ✅ Super Admin bypass
      if (roleData.name === 'Super Admin') return next();

      // ✅ Check permission
      if (roleData.permissions?.[module]?.[action] === true) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: `You don't have permission to ${action} in ${module}`,
      });

    } catch (error) {
      console.error('Authorization Error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
};