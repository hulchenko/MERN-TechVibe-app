import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

const getProducts = asyncHandler(async (req, res) => {
  // Pagination params
  const pageSize = 5;
  const page = Number(req.query.pageNum) || 1;

  // Search params
  const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: "i" } } : {}; //$options i is for insensitive case
  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    ...req.body,
    user: req.user._id,
    numReviews: 0,
  });

  if (product) {
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } else {
    res.status(400);
    throw new Error("Product was not provided");
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, image, genre, countInStock, description } = req.body;
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (product) {
    product.name = name;
    product.price = price;
    product.image = image;
    product.genre = genre;
    product.countInStock = countInStock;
    product.description = description;
  } else {
    res.status(404);
    throw new Error("Product not found");
  }

  const updateProduct = await product.save();
  res.json(updateProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product deleted" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  const userId = req.user._id;
  if (product) {
    const reviewed = product.reviews.find((review) => review.user.toString() === userId.toString());
    if (reviewed) {
      res.status(400);
      throw new Error("Product has already been reviewed");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: userId,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    const reviewSum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.rating = reviewSum / product.numReviews;

    await product.save();
    res.status(201).json({ message: "Thank you for the review!" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const getTopProducts = asyncHandler(async (req, res) => {
  // highest rating products for carousel view
  const maxToDisplay = 3;
  const product = await Product.find({}).sort({ rating: -1 }).limit(maxToDisplay);
  return res.status(200).json(product);
});

export { createProduct, createProductReview, deleteProduct, getProductById, getProducts, updateProduct, getTopProducts };
