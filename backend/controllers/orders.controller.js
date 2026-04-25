import Order from '../models/Order.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    // Destructure the specific fields sent by your n8n agent
    const { 
      name, 
      phone_number, 
      email_address, 
      service_type, 
      quantity, 
      comments 
    } = req.body;

    // Create the new order instance using your Schema
    const newOrder = new Order({ 
      name: name, 
      phone: phone_number, 
      email: email_address, 
      product: service_type, 
      quantity: Number(quantity), // Ensure quantity is handled as a number
      notes: comments || "none",
      status: "Pending" // Default status for new orders
    });

    await newOrder.save();

    // Respond with success to n8n
    res.status(201).json({ 
      success: true, 
      message: "Order created successfully",
      orderId: newOrder._id 
    });

  } catch (error) {
    // Log error for debugging and notify n8n of the failure
    console.error("Order Creation Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};