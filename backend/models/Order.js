// import mongoose from 'mongoose';

// const OrderSchema = new mongoose.Schema({
//   // Order ID - e.g., PKN-2026-001
//   orderId: {
//     type: String,
//     unique: true,
//     required: true,
//     trim: true
//   },
//   client: {
//     type: String,
//     required: [true, 'Client name is required'],
//     trim: true
//   },
//   // Packaging Details
//   product: {
//     type: String,
//     required: true,
//     enum: [
//       'SOS Paper Bags (V-Shape)',
//       'Luxury Corrugated Boxes',
//       'Eco-Takeaway Trays',
//       'Custom Branded Mailing Bags',
//       'Heavy Duty Shipping Cartons'
//     ]
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: [1, 'Quantity must be at least 1']
//   },
//   // Production Workflow Status
//   status: {
//     type: String,
//     required: true,
//     enum: ['Queue', 'Printing', 'Die-Cutting', 'Folding', 'Packing', 'Ready', 'Delivered'],
//     default: 'Queue'
//   },
//   // Progress tracking (0 to 100)
//   progress: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 100
//   },
//   // Delivery/Deadline tracking
//   dueDate: {
//     type: Date,
//     required: true
//   },
//   // Created By (Reference to the User who entered the order)
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   // Additional factory notes (e.g., "Ink code: Pantone 293C")
//   notes: {
//     type: String,
//     trim: true
//   }
// }, {
//   timestamps: true // Adds createdAt (Order Date) and updatedAt
// });

// // Virtual for frontend compatibility (mapping _id to id)
// OrderSchema.virtual('id').get(function() {
//   return this._id.toHexString();
// });

// OrderSchema.set('toJSON', {
//   virtuals: true,
//   versionKey: false,
//   transform: function (doc, ret) { delete ret._id; }
// });

// const Order = mongoose.model('Order', OrderSchema);

// export default Order;