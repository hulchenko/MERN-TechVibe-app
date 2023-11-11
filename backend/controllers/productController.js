import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// Fetch all products -> GET /api/products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// Fetch a product by id -> GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        return res.json(product);
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

export { getProducts, getProductById };