const { validationResult } = require('express-validator');
const ProductService = require('../services/product_service');
const MessageHelper = require('../helper/message.helper');
const ResponseError = require('../error/response.error');

/**
 * ProductController - HTTP request handling for product operations
 * @class ProductController
 */
class ProductController {
    /**
     * Create new product - POST /api/v1/products
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    async create(req, res, next) {
        try {
            // 1. Validation check
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponseError(400, 'Validation failed', errors.array());
            }

            // 2. Extract data
            const { body } = req;
            const userId = req.user?.id; // From auth middleware

            // 3. Service call
            const result = await ProductService.create(body, userId);

            // 4. Success response
            return await MessageHelper.showMessage(201, {
                Data: result,
                Type: "PRODUCT_CREATE"
            }, true, res);

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get product list with pagination - GET /api/v1/products
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    async getList(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponseError(400, 'Validation failed', errors.array());
            }

            const { query } = req;
            const result = await ProductService.getList(query);

            return await MessageHelper.showMessage(200, {
                Data: result,
                Type: "PRODUCT_LIST"
            }, true, res);

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get product by ID - GET /api/v1/products/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    async getById(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponseError(400, 'Validation failed', errors.array());
            }

            const { id } = req.params;
            const result = await ProductService.getById(id);

            if (!result) {
                throw new ResponseError(404, 'Product not found');
            }

            return await MessageHelper.showMessage(200, {
                Data: result,
                Type: "PRODUCT_DETAIL"
            }, true, res);

        } catch (error) {
            next(error);
        }
    }

    /**
     * Update product by ID - PUT /api/v1/products/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    async update(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponseError(400, 'Validation failed', errors.array());
            }

            const { id } = req.params;
            const { body } = req;
            const userId = req.user?.id;

            const result = await ProductService.update(id, body, userId);

            return await MessageHelper.showMessage(200, {
                Data: result,
                Type: "PRODUCT_UPDATE"
            }, true, res);

        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete product by ID - DELETE /api/v1/products/:id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    async delete(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponseError(400, 'Validation failed', errors.array());
            }

            const { id } = req.params;
            const userId = req.user?.id;

            await ProductService.delete(id, userId);

            return await MessageHelper.showMessage(200, {
                Data: null,
                Type: "PRODUCT_DELETE"
            }, true, res);

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get product statistics - GET /api/v1/products/stats
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    async getStats(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponseError(400, 'Validation failed', errors.array());
            }

            const { query } = req;
            const result = await ProductService.getStats(query);

            return await MessageHelper.showMessage(200, {
                Data: result,
                Type: "PRODUCT_STATS"
            }, true, res);

        } catch (error) {
            next(error);
        }
    }

    /**
     * Bulk update products - PATCH /api/v1/products/bulk
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    async bulkUpdate(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponseError(400, 'Validation failed', errors.array());
            }

            const { body } = req;
            const userId = req.user?.id;

            const result = await ProductService.bulkUpdate(body, userId);

            return await MessageHelper.showMessage(200, {
                Data: result,
                Type: "PRODUCT_BULK_UPDATE"
            }, true, res);

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductController();