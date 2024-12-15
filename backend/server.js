import express from "express";
import path from "path";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Init setup
dotenv.config();
connectDB(); //connect to mongoDB
const port = process.env.PORT || 5000;
const __dirname = path.resolve(); // set current directory as __dirname
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // allows to access req.cookies.cookie_name

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.get("/api/config/paypal", (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }));
app.get("/api/config/aws", (req, res) =>
  res.send({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  })
);

if (process.env.NODE_ENV === "production") {
  // provide express with React build folder
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // if requesting route is not /api - redirect to index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  // dev server
  app.get("/", (req, res) => {
    res.send("API is running!");
  });
}

// Additional middleware for missing routes/error handling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port: ${port}`));
