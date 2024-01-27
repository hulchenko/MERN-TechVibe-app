import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

// Create new order
// POST api/orders
const addOrderItems = asyncHandler(async (req, res) => {
    res.send('Add order items');
});

// Get order by id
// GET api/orders
const getAllOrders = asyncHandler(async (req, res) => {
    res.send('Get all orders');
});

// Get logged-in orders
// GET api/orders/myorder
const getMyOrder = asyncHandler(async (req, res) => {
    res.send('Get my order');
});

// Get order by id
// GET api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
    res.send('Get order by id');
});

// Update paid status of the order
// PUT api/orders/:id/pay

const updateOrderPaid = asyncHandler(async (req, res) => {
    res.send('Update paid status of the order');
});

// Update delivered status of the order
// PUT api/orders/:id/deliver

const updateOrderDelivered = asyncHandler(async (req, res) => {
    res.send('Update delivered status of the order');
});


export { addOrderItems, getAllOrders, getMyOrder, getOrderById, updateOrderDelivered, updateOrderPaid };