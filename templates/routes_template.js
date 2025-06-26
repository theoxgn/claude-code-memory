const express = require('express');
const router = express.Router();

// Import dependencies
const ProductController = require('../../controller/product_controller');
const ProductValidation = require('../../validation/product_validation');
const authMuatpartsRequired = require('../../middleware/authentication_muattrans');

/**
 * @route   POST /api/v1/products
 * @desc    Create new product
 * @access  Private (JWT required)
 */
router.post('/',
    authMuatpartsRequired, // JWT authentication
    ProductValidation.create(), // Input validation
    ProductController.create
);

/**
 * @route   GET /api/v1/products
 * @desc    Get product list with pagination and filtering
 * @access  Private (JWT required)
 */
router.get('/',
    authMuatpartsRequired,
    ProductValidation.getList(),
    ProductController.getList
);

/**
 * @route   GET /api/v1/products/stats
 * @desc    Get product statistics
 * @access  Private (JWT required)
 * @note    This route must be before /:id to avoid conflicts
 */
router.get('/stats',
    authMuatpartsRequired,
    ProductValidation.getStats(),
    ProductController.getStats
);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get single product by ID
 * @access  Private (JWT required)
 */
router.get('/:id',
    authMuatpartsRequired,
    ProductValidation.getById(),
    ProductController.getById
);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update product by ID
 * @access  Private (JWT required)
 */
router.put('/:id',
    authMuatpartsRequired,
    ProductValidation.update(),
    ProductController.update
);

/**
 * @route   PATCH /api/v1/products/bulk
 * @desc    Bulk update products
 * @access  Private (JWT required)
 * @note    This route must be before /:id to avoid conflicts
 */
router.patch('/bulk',
    authMuatpartsRequired,
    ProductValidation.bulkUpdate(),
    ProductController.bulkUpdate
);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete product by ID (soft delete)
 * @access  Private (JWT required)
 */
router.delete('/:id',
    authMuatpartsRequired,
    ProductValidation.delete(),
    ProductController.delete
);

module.exports = router;

/*
Usage in main app routes (e.g., src/routes/v1/products/index.js):

const express = require('express');
const router = express.Router();

// Import product routes
const productRoutes = require('./product_routes');

// Mount product routes
router.use('/', productRoutes);

module.exports = router;

Then in main v1 routes (src/routes/v1/index.js):
const productRoutes = require('./products');
router.use('/products', productRoutes);

Final endpoint structure:
- POST   /api/v1/products
- GET    /api/v1/products
- GET    /api/v1/products/stats
- GET    /api/v1/products/:id
- PUT    /api/v1/products/:id
- PATCH  /api/v1/products/bulk
- DELETE /api/v1/products/:id
*/