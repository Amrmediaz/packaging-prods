import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';

export const protect = async (req, res, next) => {
  try {
    // 1. Check if token exists
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

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    // 4. Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    // 5. Attach user to request
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized - Invalid token',
    });
  }
};

// Role based access control
export const authorize = (module, action) => {
  return async (req, res, next) => {
    try {
      // Find the role document
      const roleData = await Role.findOne({ name: req.user.role });
      
      if (!roleData) {
        return res.status(403).json({ success: false, message: "Role not found" });
      }

      // 1. Super Admin always has access (The "Bypass")
      if (roleData.name === 'Super Admin') return next();

      // 2. FIXED: Access the nested permission
      // Instead of `${module}_${action}`, we access roleData.permissions[module][action]
      // We use optional chaining (?.) to prevent crashes if a module is missing
      if (roleData.permissions?.[module]?.[action] === true) {
        return next();
      }

      // 3. Deny access if permission is false or missing
      return res.status(403).json({
        success: false,
        message: `You don't have permission to ${action} in ${module}`
      });
    } catch (error) {
      console.error('Authorization Error:', error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
};