const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware'); // Make sure your auth middleware path matches your project structure

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);


module.exports = router;