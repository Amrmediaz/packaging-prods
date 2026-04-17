// Role.js
import mongoose from 'mongoose';

// We use { strict: false } for permissions to allow flexibility,
// but you can define it strictly if MODULES/ACTIONS are fixed.
const PermissionSchema = new mongoose.Schema({
  // Example structure stored here: { inventory: { view: true, create: true... }, orders: {...} }
}, { strict: false, _id: false });

const RoleSchema = new mongoose.Schema({
  // Use Mongoose's auto-generated _id as 'id'
  name: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#3b82f6' // Default to a blue
  },
  description: {
    type: String,
    trim: true
  },
  // This matches your nested structure
  permissions: {
    type: PermissionSchema,
    required: true,
    default: {} // Should be initialized via mkPerms() from frontend logic usually
  },
  // To identify built-in system roles that shouldn't be deleted
  isBuiltIn: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Duplicate the virtual 'id' field from '_id' for frontend compatibility
RoleSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
RoleSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id;  }
});



const Role = mongoose.model('Role', RoleSchema);

export default Role;