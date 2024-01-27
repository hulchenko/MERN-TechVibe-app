import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

// Create new order
// POST api/orders
const addOrderItems = asyncHandler(async (req, res) => {
    res.send('Add order items');
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
// GET api/orders/:id/pay

const updateOrderPaid = asyncHandler(async (req, res) => {
    res.send('Update paid status of the order');
});


export { getProducts, getProductById };