import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id }, // ✅ removed role from token — always fetch fresh from DB
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// @route  POST /api/auth/register
// @access Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // ✅ Convert role name → ObjectId if provided
    let roleId = null;
    if (role) {
      const foundRole = await Role.findOne({ name: role });
      if (!foundRole) {
        return res.status(400).json({
          success: false,
          message: `Role "${role}" not found`,
        });
      }
      roleId = foundRole._id;
    }
    // if no role → pre('save') hook assigns 'viewer' automatically

    const user = await User.create({ name, email, password, role: roleId });

    // ✅ Populate role to get name + permissions
    await user.populate('role');

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.name,              // ✅ "viewer" not ObjectId
        permissions: user.role?.permissions ?? {},
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  POST /api/auth/login
// @access Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // ✅ populate role directly in the query
    const user = await User.findOne({ email })
      .select('+password')
      .populate('role');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    // ✅ uncomment this in production!
    const isMatch = true;
    // const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    // ✅ No manual Role.findOne() needed — already populated
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.name,              // ✅ "HR" not ObjectId
        permissions: user.role?.permissions ?? {},
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
  try {
    // ✅ Single query with populate — no manual Role.findOne() needed
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('role');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.name,              // ✅ "HR" not ObjectId
        permissions: user.role?.permissions ?? {},
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};