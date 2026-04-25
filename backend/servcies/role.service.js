// role.service.js
import Role from '../models/Role.js';
 class RoleService {
  async createRole(roleData) {
    const { name } = roleData;

    // Business Rule: Name is required
    if (!name) throw new Error('VALIDATION_NAME_REQUIRED');

    // Business Rule: Name restriction (Open/Closed principle: easy to extend)
    if (name.trim().toLowerCase().includes('super admin')) {
      throw new Error('VALIDATION_FORBIDDEN_NAME');
    }

    // Business Rule: Uniqueness
    const existingRole = await Role.findOne({ 
      name: { $regex: `^${name.trim()}$`, $options: 'i' } 
    });
    
    if (existingRole) throw new Error('VALIDATION_ALREADY_EXISTS');

    const newRole = new Role({
      ...roleData,
      name: name.trim(),
      isBuiltIn: false
    });

    return await newRole.save();
  }
  async updateRole(id, updateData) {
    const role = await Role.findById(id);

    // Rule: Existence check
    if (!role) throw new Error('NOT_FOUND');

    // Rule: Protection of System Roles (Single Responsibility)
    if (role.isBuiltIn) throw new Error('FORBIDDEN_SYSTEM_ROLE');

    // Rule: Prevent accidental name clashes if name is being changed
    if (updateData.name) {
      const duplicate = await Role.findOne({ 
        _id: { $ne: id }, 
        name: { $regex: `^${updateData.name.trim()}$`, $options: 'i' } 
      });
      if (duplicate) throw new Error('DUPLICATE_NAME');
    }

    // Perform update
    return await Role.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }
  async deleteRole(id) {
    const role = await Role.findById(id);

    // Rule: Existence check
    if (!role) throw new Error('NOT_FOUND');

    // Rule: Business Invariant - Cannot delete built-in roles
    if (role.isBuiltIn) throw new Error('FORBIDDEN_SYSTEM_ROLE');

    await Role.findByIdAndDelete(id);
    return id;
  }
  async findAllRoles() {
    // Business Rule: Always return roles sorted by creation date (oldest first)
    return await Role.find().sort({ createdAt: 1 });
  }
}

export default RoleService;
