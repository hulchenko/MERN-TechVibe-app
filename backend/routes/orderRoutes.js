import express from 'express';
const router = express.Router();

import { addOrderItems, getAllOrders, getOrderById, getMyOrder, updateOrderDelivered, updateOrderPaid } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getAllOrders).post(protect, addOrderItems);
router.route('/myorder').get(protect, getMyOrder);
router.route('/:id').get(protect, admin, getOrderById);
router.route('/:id/pay').put(protect, admin, updateOrderPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderDelivered);

export default router;