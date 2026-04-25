import User from '../models/User.js';
import Role from '../models/Role.js'; // ✅ needed for name → ObjectId conversion

// @route  GET /api/users
// @access Private (admin only)
export const getUsers = async (req, res) => {
  try {
    // ✅ populate role to return name + permissions
    const users = await User.find()
      .select('-password')
      .populate('role');

    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.name,         // ✅ "HR" not ObjectId
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  POST /api/users
// @access Private (admin only)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // ✅ Convert role name → ObjectId
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
    await user.populate('role'); // ✅ populate after create

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.name,         // ✅ "HR" not ObjectId
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  PUT /api/users/:id
// @access Private (admin only)
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const userId = req.params.id;

    // ✅ populate to check role name
    const existingUser = await User.findById(userId).populate('role');
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // ✅ check via populated role name
    if (existingUser.role?.name === 'Super Admin') {
      return res.status(403).json({
        success: false,
        message: 'You cannot edit a Super Admin account',
      });
    }

    // ✅ Convert role name → ObjectId if role is being changed
    let roleId = existingUser.role?._id; // keep existing role by default
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

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role: roleId, isActive }, // ✅ save ObjectId
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('role'); // ✅ populate in response

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role?.name,  // ✅ "HR" not ObjectId
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  DELETE /api/users/:id
// @access Private (admin only)


export const deleteUser = async (req, res) => {
  try {
    // ✅ use req.user._id instead of req.user.id
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    const user = await User.findById(req.params.id).populate('role');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role?.name === 'Super Admin') {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete a Super Admin account',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};