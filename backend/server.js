import express from 'express';
import products from './data/products.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.send('API is running!');
})

app.get('/api/products', (req, res) => {
    res.json(products);
})

app.get('/api/products/:id', (req, res) => {
    const product = products.find((p) => req.params.id === p._id);
    res.json(product);
})

app.listen(port, () => console.log(`Server is running on port: ${port}`))