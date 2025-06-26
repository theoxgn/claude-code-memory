# Claude Backend Development Rules

You are an experienced backend developer tasked with adding new features to an existing Node.js/Express project. The project structure and models are already in place, so your focus is solely on implementing APIs according to the existing code standards.

## Project Architecture Overview

This is a multi-database Node.js/Express application using:
- **ORM**: Sequelize with multiple database connections
- **Authentication**: JWT with session management
- **Validation**: express-validator
- **Response Format**: Centralized MessageHelper
- **Error Handling**: Custom ResponseError class
- **Architecture**: MVC with service layer

## 1. Naming Conventions (MANDATORY)

### File Naming
- **Controllers**: `[module_name]_controller.js` (snake_case)
- **Services**: `[module_name]_service.js` (snake_case) 
- **Routes**: `[module_name]_routes.js` (snake_case)
- **Validation**: `[module_name]_validation.js` (snake_case)
- **Models**: `[model_name].model.js` (snake_case)

### Class Naming
- **Controllers**: `[ModuleName]Controller` (PascalCase)
- **Services**: `[ModuleName]Service` (PascalCase)
- **Models**: `MT[ModelName]` for MuatTrans models (PascalCase with prefix)

### Variable Naming
- **Variables**: camelCase (e.g., `fullName`, `orderData`)
- **Database fields**: snake_case in database, camelCase in models
- **Constants**: UPPER_SNAKE_CASE

## 2. File Structure Template

```
src/
├── controller/
│   └── [module_name]_controller.js
├── services/
│   └── [module_name]_service.js
├── routes/
│   └── v1/[module_group]/
│       └── [module_name]_routes.js
├── validation/
│   └── [module_name]_validation.js
└── models/muattrans/
    └── [model_name].model.js
```

## 3. Model Implementation Pattern (CORRECTED)

```javascript
const { Model, DataTypes } = require('sequelize');
const { dbMuatTrans } = require('..');

class MT[ModelName] extends Model {}

MT[ModelName].init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'id'
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'name'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description'
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
        field: 'status'
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'category_id'
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
    },
    deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at'
    }
}, {
    sequelize: dbMuatTrans,
    modelName: 'MT[ModelName]',
    tableName: 'dbm_mt_[table_name]', // Master table: dbm_mt_, Transaction: dbt_mt_
    timestamps: true,
    paranoid: true // Enables soft deletes
});

// Inline associations (import related models as needed)
const MTUser = require('./user.model');
const MTCategory = require('./category.model');

// Define associations directly after model definition
MT[ModelName].belongsTo(MTUser, {
    as: 'creator',
    foreignKey: 'createdBy',
    onDelete: 'SET NULL'
});

MT[ModelName].belongsTo(MTCategory, {
    as: 'category',
    foreignKey: 'categoryId',
    onDelete: 'RESTRICT'
});

module.exports = MT[ModelName];
```

### Model Requirements
- **MANDATORY**: Use `MT` prefix for MuatTrans models
- **MANDATORY**: UUID primary key with `DataTypes.UUIDV4`
- **MANDATORY**: Map camelCase properties to snake_case fields using `field` attribute
- **MANDATORY**: Define timestamps explicitly with field mapping
- **MANDATORY**: Enable soft deletes with `paranoid: true`
- **MANDATORY**: Use inline associations (not static associate method)
- **MANDATORY**: Use appropriate table naming (dbm_mt_ for master, dbt_mt_ for transaction)
- **MANDATORY**: Import related models after model definition

## 4. Controller Implementation Pattern

### Class Structure
```javascript
const { validationResult } = require('express-validator');
const [ModuleName]Service = require('../services/[module_name]_service');
const MessageHelper = require('../helper/message.helper');
const ResponseError = require('../error/response.error');

class [ModuleName]Controller {
    /**
     * Create new [module] record
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
            const result = await [ModuleName]Service.create(body, userId);

            // 4. Success response
            return await MessageHelper.showMessage(201, {
                Data: result,
                Type: "[MODULE]_CREATE"
            }, true, res);

        } catch (error) {
            next(error);
        }
    }

    async getList(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponseError(400, 'Validation failed', errors.array());
            }

            const { query } = req;
            const result = await [ModuleName]Service.getList(query);

            return await MessageHelper.showMessage(200, {
                Data: result,
                Type: "[MODULE]_LIST"
            }, true, res);

        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponseError(400, 'Validation failed', errors.array());
            }

            const { id } = req.params;
            const result = await [ModuleName]Service.getById(id);

            if (!result) {
                throw new ResponseError(404, 'Data not found');
            }

            return await MessageHelper.showMessage(200, {
                Data: result,
                Type: "[MODULE]_DETAIL"
            }, true, res);

        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponseError(400, 'Validation failed', errors.array());
            }

            const { id } = req.params;
            const { body } = req;
            const userId = req.user?.id;

            const result = await [ModuleName]Service.update(id, body, userId);

            return await MessageHelper.showMessage(200, {
                Data: result,
                Type: "[MODULE]_UPDATE"
            }, true, res);

        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponseError(400, 'Validation failed', errors.array());
            }

            const { id } = req.params;
            const userId = req.user?.id;

            await [ModuleName]Service.delete(id, userId);

            return await MessageHelper.showMessage(200, {
                Data: null,
                Type: "[MODULE]_DELETE"
            }, true, res);

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new [ModuleName]Controller();
```

### Controller Requirements
- **MANDATORY**: Export instantiated class `new [ModuleName]Controller()`
- **MANDATORY**: Use try-catch in all methods with `next(error)`
- **MANDATORY**: Validate using `validationResult(req)`
- **MANDATORY**: Use `MessageHelper.showMessage()` for responses
- **MANDATORY**: Extract user from `req.user` (auth middleware)
- **MANDATORY**: Use appropriate HTTP status codes (200, 201, 400, 404, 500)

## 5. Service Implementation Pattern

### Class Structure
```javascript
const { Op, Transaction } = require('sequelize');
const { dbMuatTrans } = require('../models');
const { MT[ModelName] } = require('../models/muattrans');
const ResponseError = require('../error/response.error');

class [ModuleName]Service {
    async create(data, userId) {
        const transaction = await dbMuatTrans.transaction();
        
        try {
            // 1. Business logic validation
            await this.validateBusinessRules(data);

            // 2. Create record
            const created = await MT[ModelName].create({
                ...data,
                createdBy: userId
            }, { transaction });

            await transaction.commit();
            return this.formatResponse(created);

        } catch (error) {
            await transaction.rollback();
            
            if (error instanceof ResponseError) {
                throw error;
            }
            throw new ResponseError(500, null, error.message);
        }
    }

    async getList(options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                search = '',
                sortBy = 'createdAt',
                sortOrder = 'DESC',
                ...filters
            } = options;

            const offset = (page - 1) * limit;
            const whereClause = this.buildWhereClause(search, filters);

            const { count, rows } = await MT[ModelName].findAndCountAll({
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

    async getById(id) {
        try {
            const record = await MT[ModelName].findOne({
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

    async update(id, data, userId) {
        const transaction = await dbMuatTrans.transaction();
        
        try {
            const existing = await MT[ModelName].findOne({
                where: { id },
                transaction
            });

            if (!existing) {
                throw new ResponseError(404, 'Data not found');
            }

            await this.validateBusinessRules(data, existing);

            await existing.update({
                ...data,
                updatedBy: userId
            }, { transaction });

            await transaction.commit();
            return this.formatResponse(existing);

        } catch (error) {
            await transaction.rollback();
            
            if (error instanceof ResponseError) {
                throw error;
            }
            throw new ResponseError(500, null, error.message);
        }
    }

    async delete(id, userId) {
        const transaction = await dbMuatTrans.transaction();
        
        try {
            const existing = await MT[ModelName].findOne({
                where: { id },
                transaction
            });

            if (!existing) {
                throw new ResponseError(404, 'Data not found');
            }

            await this.validateDeletion(existing);

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

    buildWhereClause(search, filters) {
        const where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== '') {
                where[key] = filters[key];
            }
        });

        return where;
    }

    getIncludes() {
        return [
            // Define your includes here
        ];
    }

    formatResponse(record) {
        return {
            id: record.id,
            name: record.name,
            description: record.description,
            status: record.status,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt
        };
    }

    async validateBusinessRules(data, existing = null) {
        // Implement business logic validation
    }

    async validateDeletion(record) {
        // Check if record can be deleted
    }
}

module.exports = new [ModuleName]Service();
```

### Service Requirements
- **MANDATORY**: Export instantiated class `new [ModuleName]Service()`
- **MANDATORY**: Use database transactions for multiple operations
- **MANDATORY**: Throw `ResponseError` for business logic errors
- **MANDATORY**: Use parameterized queries (ORM prevents SQL injection)
- **MANDATORY**: Handle UUID validation and field mapping
- **MANDATORY**: Implement proper error handling with transaction rollback

## 6. Route Implementation Pattern

```javascript
const express = require('express');
const router = express.Router();

const [ModuleName]Controller = require('../../controller/[module_name]_controller');
const [ModuleName]Validation = require('../../validation/[module_name]_validation');
const authMuatpartsRequired = require('../../middleware/authentication_muattrans');

/**
 * @route   POST /api/v1/[module_group]/[module]
 * @desc    Create new [module]
 * @access  Private (JWT required)
 */
router.post('/',
    authMuatpartsRequired, // JWT authentication
    [ModuleName]Validation.create(), // Input validation
    [ModuleName]Controller.create
);

/**
 * @route   GET /api/v1/[module_group]/[module]
 * @desc    Get [module] list with pagination
 * @access  Private (JWT required)
 */
router.get('/',
    authMuatpartsRequired,
    [ModuleName]Validation.getList(),
    [ModuleName]Controller.getList
);

/**
 * @route   GET /api/v1/[module_group]/[module]/:id
 * @desc    Get single [module] by ID
 * @access  Private (JWT required)
 */
router.get('/:id',
    authMuatpartsRequired,
    [ModuleName]Validation.getById(),
    [ModuleName]Controller.getById
);

/**
 * @route   PUT /api/v1/[module_group]/[module]/:id
 * @desc    Update [module] by ID
 * @access  Private (JWT required)
 */
router.put('/:id',
    authMuatpartsRequired,
    [ModuleName]Validation.update(),
    [ModuleName]Controller.update
);

/**
 * @route   DELETE /api/v1/[module_group]/[module]/:id
 * @desc    Delete [module] by ID (soft delete)
 * @access  Private (JWT required)
 */
router.delete('/:id',
    authMuatpartsRequired,
    [ModuleName]Validation.delete(),
    [ModuleName]Controller.delete
);

module.exports = router;
```

### Route Requirements
- **MANDATORY**: Use `authMuatpartsRequired` for protected routes
- **MANDATORY**: Apply validation middleware before controller
- **MANDATORY**: Follow RESTful API design principles
- **MANDATORY**: Add JSDoc comments for each route
- **MANDATORY**: Use appropriate HTTP methods (GET, POST, PUT, DELETE)

## 7. Validation Implementation Pattern

```javascript
const { body, query, param } = require('express-validator');

class [ModuleName]Validation {
    create() {
        return [
            body('name')
                .trim()
                .notEmpty()
                .withMessage('Name is required')
                .isLength({ min: 3, max: 100 })
                .withMessage('Name must be between 3-100 characters')
                .escape(),
            
            body('description')
                .optional()
                .trim()
                .isLength({ max: 500 })
                .withMessage('Description must not exceed 500 characters')
                .escape(),
            
            body('categoryId')
                .optional()
                .isUUID(4)
                .withMessage('Category ID must be a valid UUID')
        ];
    }

    update() {
        return [
            body('name')
                .optional()
                .trim()
                .isLength({ min: 3, max: 100 })
                .withMessage('Name must be between 3-100 characters')
                .escape(),
            
            body('description')
                .optional()
                .trim()
                .isLength({ max: 500 })
                .withMessage('Description must not exceed 500 characters')
                .escape()
        ];
    }

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
                .escape()
        ];
    }

    getById() {
        return [
            param('id')
                .isUUID(4)
                .withMessage('ID must be a valid UUID')
        ];
    }

    delete() {
        return [
            param('id')
                .isUUID(4)
                .withMessage('ID must be a valid UUID')
        ];
    }
}

module.exports = new [ModuleName]Validation();
```

### Validation Requirements
- **MANDATORY**: Export instantiated class `new [ModuleName]Validation()`
- **MANDATORY**: Use `trim()` and `escape()` for sanitization
- **MANDATORY**: Validate UUID format with `isUUID(4)`
- **MANDATORY**: Provide descriptive error messages
- **MANDATORY**: Use appropriate validators for each field type

## 8. Error Handling Standards

### Custom Error Usage
```javascript
// Business logic error
throw new ResponseError(400, 'Invalid business rule', 'Specific error details');

// Not found error
throw new ResponseError(404, 'Data not found');

// Server error
throw new ResponseError(500, null, error.message);
```

### Error Response Format
```javascript
{
    "Message": {
        "Code": 400,
        "Text": "Bad Request"
    },
    "Data": null,
    "Type": "ERROR"
}
```

## 9. Response Format Standards

### Success Response
```javascript
return await MessageHelper.showMessage(200, {
    Data: result,
    Type: "MODULE_OPERATION"
}, true, res);
```

### Response Structure
```javascript
{
    "Message": {
        "Code": 200,
        "Text": "OK"
    },
    "Data": {
        // Your response data
    },
    "Type": "MODULE_OPERATION"
}
```

## 10. Authentication & Authorization

### Available Middleware
- `authMuatpartsRequired`: Mandatory JWT authentication
- `authMuatpartsOptional`: Optional JWT authentication
- `authMuatpartsCheck`: Basic auth validation

### User Access in Controllers
```javascript
// User ID from JWT token
const userId = req.user?.id;

// User details from JWT
const userRole = req.user?.role;
const userType = req.user?.userType;
const fullName = req.user?.fullName;
const email = req.user?.email;
```

## 11. Database Best Practices

### Transaction Usage
```javascript
const transaction = await dbMuatTrans.transaction();
try {
    // Multiple database operations
    await transaction.commit();
} catch (error) {
    await transaction.rollback();
    throw error;
}
```

### Query Optimization
- Use `include` for joins
- Use `attributes` to select specific fields
- Use `distinct: true` for accurate counts with joins
- Implement pagination with `limit` and `offset`

## 12. Implementation Checklist

### Pre-Implementation
- [ ] Analyze existing similar modules for patterns
- [ ] Identify required database models
- [ ] Plan API endpoints and methods
- [ ] Design validation rules

### During Implementation
- [ ] Follow naming conventions strictly
- [ ] Implement proper error handling
- [ ] Add comprehensive validation
- [ ] Use database transactions
- [ ] Test authentication integration

### Post-Implementation
- [ ] Test all endpoints manually
- [ ] Verify error responses
- [ ] Check authentication/authorization
- [ ] Review code for security issues
- [ ] Add documentation

## 13. Common Patterns to Follow

### Controller Pattern
1. Validate request using `validationResult(req)`
2. Extract data from `req.body`, `req.params`, `req.query`
3. Get user info from `req.user`
4. Call service method
5. Return formatted response using `MessageHelper`
6. Handle errors with `next(error)`

### Service Pattern
1. Start database transaction if needed
2. Validate business rules
3. Perform database operations
4. Commit transaction
5. Return formatted data
6. Rollback on error and throw `ResponseError`

### Validation Pattern
1. Use appropriate validators (`body`, `query`, `param`)
2. Add sanitization (`trim`, `escape`)
3. Provide clear error messages
4. Validate UUIDs, enums, and data types

## 14. Additional Best Practices

### Environment Variables
```javascript
// Use environment variables for configuration
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;
const JWT_SECRET = process.env.JWT_SECRET;
```

### Logging
```javascript
// Use LogHelper for consistent logging
const LogHelper = require('../helper/log.helper');

// Log important events
LogHelper.info('User created successfully', { userId, email });
LogHelper.error('Database error', error);
```

### Common Data Types in Models
```javascript
// UUID fields
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4

// Currency fields (Indonesian Rupiah)
type: DataTypes.DECIMAL(15, 2)

// Coordinates
type: DataTypes.FLOAT

// Enum status fields
type: DataTypes.ENUM('active', 'inactive', 'pending')

// Boolean flags
type: DataTypes.BOOLEAN,
defaultValue: false

// Large text content
type: DataTypes.TEXT

// JSON data
type: DataTypes.JSONB
```

### Security Checklist
- [ ] Input validation and sanitization implemented
- [ ] SQL injection prevention (use ORM only)
- [ ] XSS protection (escape user input)
- [ ] Authentication required on protected routes
- [ ] Proper error handling (don't expose sensitive data)
- [ ] Rate limiting on public endpoints
- [ ] HTTPS in production
- [ ] Environment variables for secrets

### Performance Optimization
- [ ] Database indexes on frequently queried fields
- [ ] Pagination for large datasets
- [ ] Use `attributes` to select only needed fields
- [ ] Implement connection pooling
- [ ] Use transactions for multiple operations
- [ ] Cache frequently accessed data when appropriate

Remember: Always prioritize security, consistency, and maintainability in your implementations.