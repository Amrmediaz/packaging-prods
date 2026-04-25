// controllers/roleControllers.js
import RoleService  from '../../backend/servcies/role.service.js'

// ─── GET ALL ROLES ─────────────────────────────────────────────────────────────
// @route   GET /api/roles
// @desc    Get all roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.findAllRoles();
    res.json(roles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
const roleService = new RoleService();

export const createRoles = async (req, res) => {
  try {
    const role = await roleService.createRole(req.body);
    return res.status(201).json(role);
  } catch (err) {
    // Map internal errors to HTTP status codes
    switch (err.message) {
      case 'VALIDATION_NAME_REQUIRED':
        return res.status(400).json({ msg: 'Please include a role name' });
      case 'VALIDATION_FORBIDDEN_NAME':
        return res.status(403).json({ msg: 'Cannot create a role with "Super Admin" in the name' });
      case 'VALIDATION_ALREADY_EXISTS':
        return res.status(400).json({ msg: 'A role with this name already exists' });
      default:
        console.error(err);
        return res.status(500).send('Server Error');
    }
  }
};

// export const createRoles = async (req, res) => {
//   const { name, color, description, permissions } = req.body;

//   if (!name) {
//     return res.status(400).json({ msg: 'Please include a role name' });
//   }

//   // Block any name that contains "super admin"
//   if (name.trim().toLowerCase().includes('super admin')) {
//     return res.status(403).json({ msg: 'Cannot create a role with "Super Admin" in the name' });
//   }

//   try {
//     const existingRole = await Role.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });
//     if (existingRole) {
//       return res.status(400).json({ msg: 'A role with this name already exists' });
//     }

//     const newRole = new Role({
//       name: name.trim(),
//       color,
//       description,
//       permissions,
//       isBuiltIn: false
//     });

//     const role = await newRole.save();
//     res.status(201).json(role);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// };
// ─── UPDATE A ROLE ─────────────────────────────────────────────────────────────
// @route   PUT /api/roles/:id
// @desc    Update a role (including partial updates like inline permission changes)
export const updateRole = async (req, res) => {
  try {
    const updatedRole = await roleService.updateRole(req.params.id, req.body);
    return res.json(updatedRole);
  } catch (err) {
    // Dependency Inversion: Controller handles the "translation" of errors
    if (err.kind === 'ObjectId' || err.message === 'NOT_FOUND') {
      return res.status(404).json({ msg: 'Role not found' });
    }
    
    if (err.message === 'FORBIDDEN_SYSTEM_ROLE') {
      return res.status(403).json({ msg: 'System roles cannot be modified' });
    }

    if (err.message === 'DUPLICATE_NAME') {
      return res.status(400).json({ msg: 'A role with this name already exists' });
    }

    console.error(err);
    res.status(500).send('Server Error');
  }
};

// ─── DELETE A ROLE ─────────────────────────────────────────────────────────────
// @route   DELETE /api/roles/:id
// @desc    Delete a role
export const deleteRole = async (req, res) => {
  try {
    const deletedId = await roleService.deleteRole(req.params.id);
    return res.json({ msg: 'Role removed', id: deletedId });
  } catch (err) {
    // Standardized Error Handling
    if (err.kind === 'ObjectId' || err.message === 'NOT_FOUND') {
      return res.status(404).json({ msg: 'Role not found' });
    }

    if (err.message === 'FORBIDDEN_SYSTEM_ROLE') {
      return res.status(403).json({ msg: 'System roles cannot be deleted' });
    }

    console.error(err);
    res.status(500).send('Server Error');
  }}