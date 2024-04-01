import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// Fetch all products -> GET /api/products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.status(200).json(products);
});

// Fetch a product by id -> GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        return res.status(200).json(product);
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

// Admin create a product -> POST /api/products
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Default name',
        price: 0,
        user: req.user._id,
        image: '/images/default.jpg',
        brand: 'Default brand',
        category: 'Default category',
        countIntStock: 0,
        numReviews: 0,
        description: 'Default description'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// Admin update a product -> PUT /api/products
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, image, brand, category, countIntStock, description } = req.body;
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        product.name = name;
        product.price = price;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countIntStock;
        product.description = description;
    } else {
        res.status(404);
        throw new Error('Product not found');
    }

    const updateProduct = await product.save();
    res.status(200).json(updateProduct);
});

export { getProducts, getProductById, createProduct, updateProduct };