import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
import { paginationParams } from "../utils/pagination.js";

const getProducts = asyncHandler(async (req, res) => {
  // Search params
  const searchParams = new RegExp(req.query.search, "i"); // case-insensitive; e.g. /TeST/i
  const search = req.query.search ? { name: searchParams } : {}; //$options i is for insensitive case

  //Pagination
  const { pageSize, page } = paginationParams(req);
  const count = await Product.countDocuments({ ...search });
  const totalPages = Math.ceil(count / pageSize);

  const products = await Product.find({ ...search })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ updatedAt: -1 });
  res.status(200).json({ products, page, pages: totalPages });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.status(200).json(product);
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
  const userId = req.user._id;
  const product = await Product.findById(productId);
  if (product) {
    product.user = userId;
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
  res.status(204).json(updateProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(204).json({ message: "Product deleted" });
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
    const reviewId = product.reviews.findIndex((review) => review.user.toString() === userId.toString());
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: userId,
    };

    if (reviewId >= 0) {
      product.reviews[reviewId] = review;
    } else {
      product.reviews.push(review);
    }

    product.numReviews = product.reviews.length;
    const reviewSum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.rating = reviewSum / product.numReviews;

    await product.save();
    if (reviewId >= 0) {
      res.status(201).json({ message: "Review updated" });
    } else {
      res.status(201).json({ message: "Review submitted" });
    }
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const getTopProducts = asyncHandler(async (req, res) => {
  // highest rating products for carousel view
  const maxToDisplay = 5;
  const product = await Product.find({}).sort({ rating: -1 }).limit(maxToDisplay);
  return res.status(200).json(product);
});

export { createProduct, createProductReview, deleteProduct, getProductById, getProducts, updateProduct, getTopProducts };
