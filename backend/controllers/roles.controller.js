// controllers/roleControllers.js
import Role from '../models/Role.js';


// ─── GET ALL ROLES ─────────────────────────────────────────────────────────────
// @route   GET /api/roles
// @desc    Get all roles
 export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: 1 }); // Oldest first
    res.json(roles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


 export const createRoles = async (req, res) => {
  const { name, color, description, permissions } = req.body;

  if (!name) {
    return res.status(400).json({ msg: 'Please include a role name' });
  }

  try {
    const newRole = new Role({
      name,
      color,
      description,
      permissions,
      isBuiltIn: false // Newly created roles are never built-in
    });

    const role = await newRole.save();
    res.status(201).json(role);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ─── UPDATE A ROLE ─────────────────────────────────────────────────────────────
// @route   PUT /api/roles/:id
// @desc    Update a role (including partial updates like inline permission changes)
 export const updateRole = async (req, res) => {
  const { name, color, description, permissions } = req.body;

  // Build temporary role object based on submitted data
  const roleFields = {};
  if (name) roleFields.name = name;
  if (color) roleFields.color = color;
  if (description) roleFields.description = description;
  if (permissions) roleFields.permissions = permissions;

  try {
    let role = await Role.findById(req.params.id);

    if (!role) return res.status(404).json({ msg: 'Role not found' });

    // Update
    role = await Role.findByIdAndUpdate(
      req.params.id,
      { $set: roleFields },
      { new: true } // Return the updated document
    );

    res.json(role);
  } catch (err) {
    console.error(err.message);
    // Check if ID is invalid format
    if(err.kind === 'ObjectId') return res.status(404).json({ msg: 'Role not found' });
    res.status(500).send('Server Error');
  }
};

// ─── DELETE A ROLE ─────────────────────────────────────────────────────────────
// @route   DELETE /api/roles/:id
// @desc    Delete a role
 export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) return res.status(404).json({ msg: 'Role not found' });

    // Prevent deletion of system roles
    if (role.isBuiltIn) {
      return res.status(403).json({ msg: 'System roles cannot be deleted' });
    }

    await Role.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Role removed', id: req.params.id });
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId') return res.status(404).json({ msg: 'Role not found' });
    res.status(500).send('Server Error');
  }
};