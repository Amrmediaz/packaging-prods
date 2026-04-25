import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  // Order ID - e.g., PKN-1713444898 (using timestamp for uniqueness)
  orderId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    default: () => `PKN-${Math.floor(Date.now() / 1000)}`
  },
  name: {
    type: String,
    required: [true, 'name is required'],
    trim: true
  },
  // Contact Details (Captured by n8n)
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  // Packaging Details (Updated for Cup Focus)
  product: {
    type: String,
    required: true,
    // Flexible string to allow specific cup types from the website
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  // Production Workflow Status
  status: {
    type: String,
    required: false,
    enum: ['Pending', 'Queue', 'Printing', 'Die-Cutting', 'Folding', 'Packing', 'Ready', 'Delivered'],
    default: 'Pending'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Automated deadline (e.g., 14 days from order)
  dueDate: {
    type: Date,
    default: () => new Date(+new Date() + 14 * 24 * 60 * 60 * 1000)
  },
  // Optional: If you aren't using an Auth system for the n8n bot, 
  // you might want to remove the 'required' constraint on createdBy
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false 
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true 
});

// Virtual for frontend compatibility
OrderSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

OrderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;