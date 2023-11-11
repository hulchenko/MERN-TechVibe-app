import express from 'express';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

connectDB(); //connect to mongoDB
const app = express();
const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.send('API is running!');
});

app.use('/api/products', productRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port: ${port}`));