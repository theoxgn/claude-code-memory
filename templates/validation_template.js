const { body, query, param } = require('express-validator');

/**
 * ProductValidation - Input validation for product operations
 * @class ProductValidation
 */
class ProductValidation {
    /**
     * Validation rules for creating product
     * @returns {Array} Array of validation middleware
     */
    create() {
        return [
            body('name')
                .trim()
                .notEmpty()
                .withMessage('Product name is required')
                .isLength({ min: 3, max: 100 })
                .withMessage('Product name must be between 3-100 characters')
                .escape(),
            
            body('description')
                .optional()
                .trim()
                .isLength({ max: 1000 })
                .withMessage('Description must not exceed 1000 characters')
                .escape(),
            
            body('sku')
                .trim()
                .notEmpty()
                .withMessage('SKU is required')
                .isLength({ min: 3, max: 50 })
                .withMessage('SKU must be between 3-50 characters')
                .matches(/^[A-Z0-9-_]+$/)
                .withMessage('SKU must contain only uppercase letters, numbers, hyphens, and underscores')
                .escape(),
            
            body('price')
                .isFloat({ min: 0 })
                .withMessage('Price must be a positive number')
                .toFloat(),
            
            body('categoryId')
                .notEmpty()
                .withMessage('Category ID is required')
                .isUUID(4)
                .withMessage('Category ID must be a valid UUID'),
            
            body('status')
                .optional()
                .isIn(['active', 'inactive'])
                .withMessage('Status must be active or inactive'),
            
            body('specifications')
                .optional()
                .isObject()
                .withMessage('Specifications must be an object'),
            
            body('tags')
                .optional()
                .isArray()
                .withMessage('Tags must be an array')
                .custom((value) => {
                    if (value.length > 10) {
                        throw new Error('Maximum 10 tags allowed');
                    }
                    return true;
                }),
            
            body('tags.*')
                .optional()
                .trim()
                .isLength({ min: 1, max: 30 })
                .withMessage('Each tag must be between 1-30 characters')
                .escape(),
            
            body('weight')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Weight must be a positive number')
                .toFloat(),
            
            body('dimensions')
                .optional()
                .isObject()
                .withMessage('Dimensions must be an object'),
            
            body('dimensions.length')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Length must be a positive number')
                .toFloat(),
            
            body('dimensions.width')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Width must be a positive number')
                .toFloat(),
            
            body('dimensions.height')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Height must be a positive number')
                .toFloat()
        ];
    }

    /**
     * Validation rules for updating product
     * @returns {Array} Array of validation middleware
     */
    update() {
        return [
            body('name')
                .optional()
                .trim()
                .isLength({ min: 3, max: 100 })
                .withMessage('Product name must be between 3-100 characters')
                .escape(),
            
            body('description')
                .optional()
                .trim()
                .isLength({ max: 1000 })
                .withMessage('Description must not exceed 1000 characters')
                .escape(),
            
            body('sku')
                .optional()
                .trim()
                .isLength({ min: 3, max: 50 })
                .withMessage('SKU must be between 3-50 characters')
                .matches(/^[A-Z0-9-_]+$/)
                .withMessage('SKU must contain only uppercase letters, numbers, hyphens, and underscores')
                .escape(),
            
            body('price')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Price must be a positive number')
                .toFloat(),
            
            body('categoryId')
                .optional()
                .isUUID(4)
                .withMessage('Category ID must be a valid UUID'),
            
            body('status')
                .optional()
                .isIn(['active', 'inactive'])
                .withMessage('Status must be active or inactive'),
            
            body('specifications')
                .optional()
                .isObject()
                .withMessage('Specifications must be an object'),
            
            body('tags')
                .optional()
                .isArray()
                .withMessage('Tags must be an array')
                .custom((value) => {
                    if (value.length > 10) {
                        throw new Error('Maximum 10 tags allowed');
                    }
                    return true;
                }),
            
            body('tags.*')
                .optional()
                .trim()
                .isLength({ min: 1, max: 30 })
                .withMessage('Each tag must be between 1-30 characters')
                .escape(),
            
            body('weight')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Weight must be a positive number')
                .toFloat(),
            
            body('dimensions')
                .optional()
                .isObject()
                .withMessage('Dimensions must be an object'),
            
            body('dimensions.length')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Length must be a positive number')
                .toFloat(),
            
            body('dimensions.width')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Width must be a positive number')
                .toFloat(),
            
            body('dimensions.height')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Height must be a positive number')
                .toFloat()
        ];
    }

    /**
     * Validation rules for getting product list
     * @returns {Array} Array of validation middleware
     */
    getList() {
        return [
            query('page')
                .optional()
                .isInt({ min: 1 })
                .withMessage('Page must be a positive integer')
                .toInt(),
            
            query('limit')
                .optional()
                .isInt({ min: 1, max: 100 })
                .withMessage('Limit must be between 1-100')
                .toInt(),
            
            query('search')
                .optional()
                .trim()
                .isLength({ max: 100 })
                .withMessage('Search term must not exceed 100 characters')
                .escape(),
            
            query('categoryId')
                .optional()
                .isUUID(4)
                .withMessage('Category ID must be a valid UUID'),
            
            query('status')
                .optional()
                .isIn(['active', 'inactive'])
                .withMessage('Status must be active or inactive'),
            
            query('minPrice')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Minimum price must be a positive number')
                .toFloat(),
            
            query('maxPrice')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Maximum price must be a positive number')
                .toFloat()
                .custom((value, { req }) => {
                    if (req.query.minPrice && parseFloat(value) < parseFloat(req.query.minPrice)) {
                        throw new Error('Maximum price must be greater than minimum price');
                    }
                    return true;
                }),
            
            query('sortBy')
                .optional()
                .isIn(['name', 'price', 'createdAt', 'updatedAt', 'sku'])
                .withMessage('Invalid sort field'),
            
            query('sortOrder')
                .optional()
                .isIn(['asc', 'desc', 'ASC', 'DESC'])
                .withMessage('Sort order must be asc or desc'),
            
            query('tags')
                .optional()
                .isArray()
                .withMessage('Tags filter must be an array'),
            
            query('tags.*')
                .optional()
                .trim()
                .isLength({ min: 1, max: 30 })
                .withMessage('Each tag must be between 1-30 characters')
                .escape()
        ];
    }

    /**
     * Validation rules for getting product by ID
     * @returns {Array} Array of validation middleware
     */
    getById() {
        return [
            param('id')
                .isUUID(4)
                .withMessage('Product ID must be a valid UUID')
        ];
    }

    /**
     * Validation rules for deleting product
     * @returns {Array} Array of validation middleware
     */
    delete() {
        return [
            param('id')
                .isUUID(4)
                .withMessage('Product ID must be a valid UUID')
        ];
    }

    /**
     * Validation rules for getting product statistics
     * @returns {Array} Array of validation middleware
     */
    getStats() {
        return [
            query('categoryId')
                .optional()
                .isUUID(4)
                .withMessage('Category ID must be a valid UUID'),
            
            query('status')
                .optional()
                .isIn(['active', 'inactive'])
                .withMessage('Status must be active or inactive'),
            
            query('dateFrom')
                .optional()
                .isISO8601()
                .withMessage('Date from must be a valid ISO 8601 date')
                .toDate(),
            
            query('dateTo')
                .optional()
                .isISO8601()
                .withMessage('Date to must be a valid ISO 8601 date')
                .toDate()
                .custom((value, { req }) => {
                    if (req.query.dateFrom && value < new Date(req.query.dateFrom)) {
                        throw new Error('Date to must be after date from');
                    }
                    return true;
                })
        ];
    }

    /**
     * Validation rules for bulk update products
     * @returns {Array} Array of validation middleware
     */
    bulkUpdate() {
        return [
            body('productIds')
                .isArray({ min: 1, max: 100 })
                .withMessage('Product IDs must be an array with 1-100 items'),
            
            body('productIds.*')
                .isUUID(4)
                .withMessage('Each product ID must be a valid UUID'),
            
            body('updates')
                .isObject()
                .withMessage('Updates must be an object')
                .custom((value) => {
                    const allowedFields = ['status', 'price', 'categoryId'];
                    const providedFields = Object.keys(value);
                    const invalidFields = providedFields.filter(field => !allowedFields.includes(field));
                    
                    if (invalidFields.length > 0) {
                        throw new Error(`Invalid update fields: ${invalidFields.join(', ')}`);
                    }
                    
                    if (providedFields.length === 0) {
                        throw new Error('At least one update field is required');
                    }
                    
                    return true;
                }),
            
            body('updates.status')
                .optional()
                .isIn(['active', 'inactive'])
                .withMessage('Status must be active or inactive'),
            
            body('updates.price')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Price must be a positive number')
                .toFloat(),
            
            body('updates.categoryId')
                .optional()
                .isUUID(4)
                .withMessage('Category ID must be a valid UUID')
        ];
    }

    /**
     * Validation rules for product search with advanced filters
     * @returns {Array} Array of validation middleware
     */
    search() {
        return [
            body('query')
                .optional()
                .trim()
                .isLength({ max: 100 })
                .withMessage('Search query must not exceed 100 characters')
                .escape(),
            
            body('filters')
                .optional()
                .isObject()
                .withMessage('Filters must be an object'),
            
            body('filters.categories')
                .optional()
                .isArray()
                .withMessage('Categories filter must be an array'),
            
            body('filters.categories.*')
                .optional()
                .isUUID(4)
                .withMessage('Each category ID must be a valid UUID'),
            
            body('filters.priceRange')
                .optional()
                .isObject()
                .withMessage('Price range must be an object'),
            
            body('filters.priceRange.min')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Minimum price must be a positive number')
                .toFloat(),
            
            body('filters.priceRange.max')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Maximum price must be a positive number')
                .toFloat(),
            
            body('filters.tags')
                .optional()
                .isArray()
                .withMessage('Tags filter must be an array'),
            
            body('filters.tags.*')
                .optional()
                .trim()
                .isLength({ min: 1, max: 30 })
                .withMessage('Each tag must be between 1-30 characters')
                .escape(),
            
            body('sort')
                .optional()
                .isObject()
                .withMessage('Sort must be an object'),
            
            body('sort.field')
                .optional()
                .isIn(['name', 'price', 'createdAt', 'updatedAt', 'relevance'])
                .withMessage('Invalid sort field'),
            
            body('sort.order')
                .optional()
                .isIn(['asc', 'desc', 'ASC', 'DESC'])
                .withMessage('Sort order must be asc or desc'),
            
            body('pagination')
                .optional()
                .isObject()
                .withMessage('Pagination must be an object'),
            
            body('pagination.page')
                .optional()
                .isInt({ min: 1 })
                .withMessage('Page must be a positive integer')
                .toInt(),
            
            body('pagination.limit')
                .optional()
                .isInt({ min: 1, max: 100 })
                .withMessage('Limit must be between 1-100')
                .toInt()
        ];
    }
}

module.exports = new ProductValidation();