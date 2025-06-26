const { Op, Transaction } = require('sequelize');
const { dbMuatTrans } = require('../models');
const { MTProduct, MTCategory, MTUser } = require('../models/muattrans');
const ResponseError = require('../error/response.error');

/**
 * ProductService - Business logic for product operations
 * @class ProductService
 */
class ProductService {
    /**
     * Create new product record
     * @param {Object} data - Product data
     * @param {string} userId - User ID performing the operation
     * @returns {Promise<Object>} Created product object
     * @throws {ResponseError} Validation or database error
     */
    async create(data, userId) {
        const transaction = await dbMuatTrans.transaction();
        
        try {
            // 1. Business logic validation
            await this.validateBusinessRules(data);

            // 2. Check if product name already exists
            const existingProduct = await MTProduct.findOne({
                where: { 
                    name: data.name,
                    categoryId: data.categoryId 
                },
                transaction
            });

            if (existingProduct) {
                throw new ResponseError(400, 'Product with this name already exists in the category');
            }

            // 3. Validate category exists
            const category = await MTCategory.findOne({
                where: { id: data.categoryId },
                transaction
            });

            if (!category) {
                throw new ResponseError(400, 'Category not found');
            }

            // 4. Create product record
            const created = await MTProduct.create({
                ...data,
                createdBy: userId,
                status: data.status || 'active'
            }, { transaction });

            // 5. Update category product count
            await MTCategory.increment('productCount', {
                where: { id: data.categoryId },
                transaction
            });

            await transaction.commit();

            // 6. Return formatted response
            return this.formatResponse(created);

        } catch (error) {
            await transaction.rollback();
            
            if (error instanceof ResponseError) {
                throw error;
            }
            throw new ResponseError(500, null, error.message);
        }
    }

    /**
     * Get product list with pagination and filtering
     * @param {Object} options - Query options (page, limit, search, filters)
     * @returns {Promise<Object>} Paginated list with metadata
     */
    async getList(options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                search = '',
                categoryId = '',
                status = '',
                sortBy = 'createdAt',
                sortOrder = 'DESC',
                minPrice = '',
                maxPrice = ''
            } = options;

            const offset = (page - 1) * limit;
            const whereClause = this.buildWhereClause(search, {
                categoryId,
                status,
                minPrice,
                maxPrice
            });

            const { count, rows } = await MTProduct.findAndCountAll({
                where: whereClause,
                include: this.getIncludes(),
                order: [[sortBy, sortOrder]],
                limit: parseInt(limit),
                offset: parseInt(offset),
                distinct: true
            });

            return {
                data: rows.map(item => this.formatResponse(item)),
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: count,
                    totalPages: Math.ceil(count / limit),
                    hasNext: page < Math.ceil(count / limit),
                    hasPrev: page > 1
                }
            };

        } catch (error) {
            if (error instanceof ResponseError) {
                throw error;
            }
            throw new ResponseError(500, null, error.message);
        }
    }

    /**
     * Get single product by ID
     * @param {string} id - Product UUID
     * @returns {Promise<Object|null>} Product object or null if not found
     */
    async getById(id) {
        try {
            const record = await MTProduct.findOne({
                where: { id },
                include: this.getIncludes()
            });

            return record ? this.formatResponse(record) : null;

        } catch (error) {
            if (error instanceof ResponseError) {
                throw error;
            }
            throw new ResponseError(500, null, error.message);
        }
    }

    /**
     * Update product by ID
     * @param {string} id - Product UUID
     * @param {Object} data - Update data
     * @param {string} userId - User ID performing the operation
     * @returns {Promise<Object>} Updated product object
     */
    async update(id, data, userId) {
        const transaction = await dbMuatTrans.transaction();
        
        try {
            // 1. Find existing record
            const existing = await MTProduct.findOne({
                where: { id },
                include: this.getIncludes(),
                transaction
            });

            if (!existing) {
                throw new ResponseError(404, 'Product not found');
            }

            // 2. Business logic validation
            await this.validateBusinessRules(data, existing);

            // 3. Check if name change conflicts with existing product
            if (data.name && data.name !== existing.name) {
                const conflictingProduct = await MTProduct.findOne({
                    where: { 
                        name: data.name,
                        categoryId: data.categoryId || existing.categoryId,
                        id: { [Op.ne]: id }
                    },
                    transaction
                });

                if (conflictingProduct) {
                    throw new ResponseError(400, 'Product with this name already exists in the category');
                }
            }

            // 4. Handle category change
            if (data.categoryId && data.categoryId !== existing.categoryId) {
                // Validate new category exists
                const newCategory = await MTCategory.findOne({
                    where: { id: data.categoryId },
                    transaction
                });

                if (!newCategory) {
                    throw new ResponseError(400, 'New category not found');
                }

                // Update category product counts
                await MTCategory.decrement('productCount', {
                    where: { id: existing.categoryId },
                    transaction
                });

                await MTCategory.increment('productCount', {
                    where: { id: data.categoryId },
                    transaction
                });
            }

            // 5. Update record
            await existing.update({
                ...data,
                updatedBy: userId
            }, { transaction });

            await transaction.commit();

            // 6. Return updated record with fresh includes
            const updated = await MTProduct.findOne({
                where: { id },
                include: this.getIncludes()
            });

            return this.formatResponse(updated);

        } catch (error) {
            await transaction.rollback();
            
            if (error instanceof ResponseError) {
                throw error;
            }
            throw new ResponseError(500, null, error.message);
        }
    }

    /**
     * Delete product by ID (soft delete)
     * @param {string} id - Product UUID
     * @param {string} userId - User ID performing the operation
     * @returns {Promise<boolean>} Success status
     */
    async delete(id, userId) {
        const transaction = await dbMuatTrans.transaction();
        
        try {
            // 1. Find existing record
            const existing = await MTProduct.findOne({
                where: { id },
                transaction
            });

            if (!existing) {
                throw new ResponseError(404, 'Product not found');
            }

            // 2. Check if product can be deleted (business rules)
            await this.validateDeletion(existing);

            // 3. Update category product count
            await MTCategory.decrement('productCount', {
                where: { id: existing.categoryId },
                transaction
            });

            // 4. Soft delete (paranoid mode)
            await existing.update({
                deletedBy: userId
            }, { transaction });
            
            await existing.destroy({ transaction });

            await transaction.commit();
            return true;

        } catch (error) {
            await transaction.rollback();
            
            if (error instanceof ResponseError) {
                throw error;
            }
            throw new ResponseError(500, null, error.message);
        }
    }

    /**
     * Get product statistics
     * @param {Object} options - Filter options
     * @returns {Promise<Object>} Statistics data
     */
    async getStats(options = {}) {
        try {
            const { categoryId, status, dateFrom, dateTo } = options;
            
            const whereClause = {};
            if (categoryId) whereClause.categoryId = categoryId;
            if (status) whereClause.status = status;
            if (dateFrom || dateTo) {
                whereClause.createdAt = {};
                if (dateFrom) whereClause.createdAt[Op.gte] = new Date(dateFrom);
                if (dateTo) whereClause.createdAt[Op.lte] = new Date(dateTo);
            }

            const [
                totalProducts,
                activeProducts,
                inactiveProducts,
                avgPrice,
                categoryStats
            ] = await Promise.all([
                MTProduct.count({ where: whereClause }),
                MTProduct.count({ where: { ...whereClause, status: 'active' } }),
                MTProduct.count({ where: { ...whereClause, status: 'inactive' } }),
                MTProduct.findOne({
                    attributes: [
                        [dbMuatTrans.fn('AVG', dbMuatTrans.col('price')), 'avgPrice']
                    ],
                    where: whereClause,
                    raw: true
                }),
                MTProduct.findAll({
                    attributes: [
                        'categoryId',
                        [dbMuatTrans.fn('COUNT', dbMuatTrans.col('id')), 'count']
                    ],
                    where: whereClause,
                    include: [{
                        model: MTCategory,
                        as: 'category',
                        attributes: ['name']
                    }],
                    group: ['categoryId', 'category.id'],
                    raw: true
                })
            ]);

            return {
                summary: {
                    totalProducts,
                    activeProducts,
                    inactiveProducts,
                    averagePrice: parseFloat(avgPrice?.avgPrice) || 0
                },
                categoryBreakdown: categoryStats.map(stat => ({
                    categoryId: stat.categoryId,
                    categoryName: stat['category.name'],
                    productCount: parseInt(stat.count)
                }))
            };

        } catch (error) {
            if (error instanceof ResponseError) {
                throw error;
            }
            throw new ResponseError(500, null, error.message);
        }
    }

    /**
     * Bulk update products
     * @param {Object} data - Bulk update data
     * @param {string} userId - User ID performing the operation
     * @returns {Promise<Object>} Update results
     */
    async bulkUpdate(data, userId) {
        const transaction = await dbMuatTrans.transaction();
        
        try {
            const { productIds, updates } = data;
            
            // 1. Validate all products exist
            const products = await MTProduct.findAll({
                where: { id: { [Op.in]: productIds } },
                transaction
            });

            if (products.length !== productIds.length) {
                throw new ResponseError(400, 'Some products not found');
            }

            // 2. Perform bulk update
            const [affectedCount] = await MTProduct.update({
                ...updates,
                updatedBy: userId
            }, {
                where: { id: { [Op.in]: productIds } },
                transaction
            });

            await transaction.commit();

            return {
                updatedCount: affectedCount,
                productIds: productIds
            };

        } catch (error) {
            await transaction.rollback();
            
            if (error instanceof ResponseError) {
                throw error;
            }
            throw new ResponseError(500, null, error.message);
        }
    }

    /**
     * Helper method to build WHERE clause for filtering
     * @private
     */
    buildWhereClause(search, filters) {
        const where = {};

        // Search functionality
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
                { sku: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Category filter
        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }

        // Status filter
        if (filters.status) {
            where.status = filters.status;
        }

        // Price range filter
        if (filters.minPrice || filters.maxPrice) {
            where.price = {};
            if (filters.minPrice) where.price[Op.gte] = parseFloat(filters.minPrice);
            if (filters.maxPrice) where.price[Op.lte] = parseFloat(filters.maxPrice);
        }

        return where;
    }

    /**
     * Helper method to define includes for queries
     * @private
     */
    getIncludes() {
        return [
            {
                model: MTCategory,
                as: 'category',
                attributes: ['id', 'name', 'description']
            },
            {
                model: MTUser,
                as: 'creator',
                attributes: ['id', 'fullName', 'email']
            }
        ];
    }

    /**
     * Helper method to format response data
     * @private
     */
    formatResponse(record) {
        return {
            id: record.id,
            name: record.name,
            description: record.description,
            sku: record.sku,
            price: record.price,
            status: record.status,
            categoryId: record.categoryId,
            category: record.category ? {
                id: record.category.id,
                name: record.category.name,
                description: record.category.description
            } : null,
            creator: record.creator ? {
                id: record.creator.id,
                fullName: record.creator.fullName,
                email: record.creator.email
            } : null,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt
        };
    }

    /**
     * Business rules validation
     * @private
     */
    async validateBusinessRules(data, existing = null) {
        // Price validation
        if (data.price !== undefined && data.price < 0) {
            throw new ResponseError(400, 'Price must be greater than or equal to 0');
        }

        // SKU validation
        if (data.sku) {
            const existingSku = await MTProduct.findOne({
                where: { 
                    sku: data.sku,
                    id: existing ? { [Op.ne]: existing.id } : { [Op.ne]: null }
                }
            });

            if (existingSku) {
                throw new ResponseError(400, 'SKU already exists');
            }
        }

        // Status validation
        if (data.status && !['active', 'inactive'].includes(data.status)) {
            throw new ResponseError(400, 'Status must be active or inactive');
        }
    }

    /**
     * Deletion validation
     * @private
     */
    async validateDeletion(record) {
        // Check if product is being used in orders
        // const orderCount = await MTOrder.count({
        //     where: { productId: record.id }
        // });

        // if (orderCount > 0) {
        //     throw new ResponseError(400, 'Cannot delete product that has associated orders');
        // }

        // Additional business rules for deletion
        if (record.status === 'active') {
            throw new ResponseError(400, 'Cannot delete active product. Please set to inactive first.');
        }
    }
}

module.exports = new ProductService();