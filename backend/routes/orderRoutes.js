import express from "express";
import Order from "../models/orderModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Get all orders (Only for authenticated users)
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find().populate("products.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// 🔐 Get a single order by ID (Only for authenticated users)
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.product");
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
});

// 🔐 Create a new order (Only for authenticated users)
router.post("/", protect, async (req, res) => {
  try {
    const { customerName, email, phone, address, products, totalAmount } = req.body;
    const newOrder = new Order({ customerName, email, phone, address, products, totalAmount });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: "Error creating order" });
  }
});

// 🔐 Update an order status (Only for authenticated users)
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order" });
  }
});

// 🔐 Delete an order (Only for authenticated users)
router.delete("/:id", protect, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
});

export default router;
