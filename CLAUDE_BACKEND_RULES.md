# Claude Backend Development Rules - UPDATED
*Based on Real Codebase Analysis*

You are an experienced backend developer tasked with adding new features to an existing Node.js/Express project. The project structure and models are already in place, so your focus is solely on implementing APIs according to the existing code standards.

## Project Architecture Overview

This is a multi-database Node.js/Express application using:
- **ORM**: Sequelize with multiple database connections
- **Authentication**: JWT with session management via `authMuatpartsRequired` (7-layer validation)
- **Validation**: express-validator with consistent patterns
- **Response Format**: Centralized MessageHelper
- **Error Handling**: Custom ResponseError class
- **Architecture**: MVC with service layer
- **Folder Structure**: Modular by domain (orders, payments, settlement)

## 1. Naming Conventions (MANDATORY)

### File Naming (UPDATED - REAL PATTERN)
- **Controllers**: `[module_name].controller.js` (snake_case, in folder)
- **Services**: `[module_name].service.js` (snake_case, in folder) 
- **Routes**: `[module_name].js` (snake_case, no suffix)
- **Validation**: `[module_name].validation.js` (snake_case, in folder)
- **Models**: `[model_name].model.js` (snake_case)

### Class Naming
- **Controllers**: `[ModuleName]Controller` (PascalCase)
- **Services**: `[ModuleName]Service` (PascalCase)
- **Models**: `MT[ModelName]` for MuatTrans models (PascalCase with prefix)

### Variable Naming
- **Variables**: camelCase (e.g., `fullName`, `orderData`)
- **Database fields**: snake_case in database, camelCase in models
- **Constants**: UPPER_SNAKE_CASE

### Model Field Mapping Verification (CRITICAL)
- **MANDATORY**: Always verify field names from actual model definitions before writing tests
- **MANDATORY**: Check camelCase vs snake_case mapping in model files
- **MANDATORY**: Example verification process:
```javascript
// 1. Read model file first
const model = require('../../models/model_name.model');

// 2. Verify field mapping
// Model defines: cargoNameID (camelCase) maps to cargo_name_id (snake_case)
await Model.create({
    cargoNameID: uuid,  // ✅ CORRECT: Use model field name
    // NOT cargoNameId    // ❌ WRONG: Assumption
});
```

## 2. File Structure Template (UPDATED - REAL PATTERN)

```
src/
├── controller/
│   └── [module_name]/
│       └── [module_name].controller.js
├── services/
│   └── [module_name]/
│       └── [module_name].service.js
├── routes/
│   └── v1/[module_group]/
│       ├── index.js (auto-mount all routes)
│       └── [module_name].js
├── validation/
│   └── [module_name]/
│       └── [module_name].validation.js
├── models/muattrans/
│   └── [model_name].model.js
└── middleware/
    └── authentication_muatparts.js
```

## 3. Model Implementation Pattern 

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

### Class Structure (REAL IMPORT ORDER)
```javascript
const MessageHelper = require('../../helper/message.helper');
const [ModuleName]Service = require('../../services/[module_name]/[module_name].service');
const ResponseError = require('../../error/response-error');
const { validationResult } = require('express-validator');

class [ModuleName]Controller {
    /**
     * Create new [module] record
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    async create(req, res, next) {
        try {
            // 1. Validation check (UPDATED - REAL PATTERN)
            const validRequest = validationResult(req);
            if (!validRequest.isEmpty()) {
                throw new ResponseError(400, validRequest.array(), 'Validation failed');
            }

            // 2. Extract data (UPDATED - REAL PATTERN)
            const userId = req.user.id; // From authMuatpartsRequired middleware
            const data = req.body;
            const languageId = req.headers.languageid || null; // Optional multi-language

            // 3. Service call (UPDATED - REAL PATTERN)
            const result = await [moduleName]Service.create(userId, data, languageId);

            // 4. Success response (UPDATED - REAL PATTERN)
            return await MessageHelper.showMessage(201, {
                Data: result,
                Type: req.originalUrl
            }, true, res);

        } catch (error) {
            next(error);
        }
    }

    async getList(req, res, next) {
        try {
            // UPDATED - REAL PATTERN
            const validRequest = validationResult(req);
            if (!validRequest.isEmpty()) {
                throw new ResponseError(400, validRequest.array(), 'Validation failed');
            }

            const userId = req.user.id; // From authMuatpartsRequired middleware
            const { page = 1, limit = 10, search, status } = req.query;
            const languageId = req.headers.languageid || null; // Optional multi-language
            
            const result = await [moduleName]Service.getList(userId, { page, limit, search, status }, languageId);

            return await MessageHelper.showMessage(200, {
                Data: result,
                Type: req.originalUrl
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

### Controller Requirements (UPDATED - REAL PATTERN)
- **MANDATORY**: Critical Import Order (EXACT SEQUENCE):
  ```javascript
  // Controllers: MessageHelper FIRST, then Service, then ResponseError
  const MessageHelper = require('../../helper/message.helper');
  const [ModuleName]Service = require('../../services/[module_name]/[module_name].service');
  const ResponseError = require('../../error/response-error');
  const { validationResult } = require('express-validator');
  ```
- **MANDATORY**: Export instantiated class `new [ModuleName]Controller()`
- **MANDATORY**: Use try-catch in all methods with `next(error)`
- **MANDATORY**: Validate using `validationResult(req)`
- **MANDATORY**: Use `MessageHelper.showMessage()` for responses
- **MANDATORY**: Extract `userId` from `req.user.id` (from auth middleware)
- **CONDITIONAL**: Add `token` parameter only if service needs external API calls (payment gateway, etc.)
  ```javascript
  // Only when needed:
  const token = req.headers.authorization;
  const result = await service.create(userId, data, token, languageId);
  ```
- **MANDATORY**: Support `languageId` from `req.headers.languageid` (optional)
- **MANDATORY**: Use appropriate HTTP status codes (200, 201, 400, 404, 500)

### Response Format Reality (CRITICAL UPDATE)
- **IMPORTANT**: MessageHelper response `Type` field behavior:
  - **Success responses**: Contains `req.originalUrl` (includes query parameters)
  - **Error responses**: Can be 'ERROR' OR contain original URL depending on error middleware
  - **Testing implication**: Use flexible assertions, not exact matches

#### Response Format Examples (ACTUAL BEHAVIOR)
```javascript
// Success Response - Type includes query params
{
    "Message": { "Code": 200, "Text": "OK" },
    "Data": { /* response data */ },
    "Type": "/v1/orders/cargos/names?cargoTypeId=uuid&page=1&limit=10"
}

// Error Response - Type can vary
{
    "Message": { "Code": 400, "Text": "Validation failed" },
    "Data": [/* validation errors */],
    "Type": "/v1/orders/cargos/names?invalidParams=true" // OR "ERROR"
}
```

## 5. Service Implementation Pattern (UPDATED - REAL CODEBASE)

### Class Structure (REAL PATTERN)
```javascript
const { Op, Transaction } = require('sequelize');
const { dbMuatTrans } = require('../../models');
const MT[ModelName] = require('../../models/muattrans/[model_name].model');
const ResponseError = require('../../error/response-error');
const languageHelper = require('../../helper/language.helper');

class [ModuleName]Service {
    /**
     * Create new [module] (UPDATED - REAL PATTERN)
     * @param {number} userId - User ID from auth middleware
     * @param {Object} data - Request data
     * @param {string} languageId - Language ID (optional)
     * @returns {Promise<Object>} Created record
     */
    async create(userId, data, languageId = null) {
        const transaction = await dbMuatTrans.transaction();
        
        try {
            // 1. Get system language if not provided (UPDATED)
            if (!languageId) {
                languageId = await languageHelper.getLangSystem();
            }

            // 2. Business logic validation
            await this.validateBusinessRules(data);

            // 3. Create record with transaction (UPDATED)
            const created = await MT[ModelName].create({
                ...data,
                userID: userId, // Note: database field is user_id, model field is userID
                isActive: true
            }, { transaction });

            // 4. Commit transaction
            await transaction.commit();

            // 5. Format response (UPDATED)
            return await this.formatResponse(created, languageId);

        } catch (error) {
            await transaction.rollback();
            throw error;
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

### Service Requirements (UPDATED - REAL PATTERN)
- **MANDATORY**: Accept `userId` as first parameter (from auth middleware)
- **MANDATORY**: Accept `languageId` parameter with fallback to `languageHelper.getLangSystem()`
- **MANDATORY**: Export instantiated class `new [ModuleName]Service()`
- **MANDATORY**: Use database transactions for multiple operations
- **MANDATORY**: Filter by `userID` for user-specific data
- **MANDATORY**: Use `isActive: true` filter (paranoid delete pattern)
- **MANDATORY**: Throw `ResponseError` for business logic errors
- **MANDATORY**: Use parameterized queries (ORM prevents SQL injection)
- **MANDATORY**: Handle UUID validation and field mapping
- **MANDATORY**: Implement proper error handling with transaction rollback

## 6. Route Implementation Pattern (UPDATED - REAL CODEBASE)

```javascript
const express = require('express');
const router = express.Router();
const { authMuatpartsRequired } = require('../../../middleware/authentication_muatparts');
const [moduleName]Validation = require('../../../validation/[module_name]/[module_name].validation');
const [moduleName]Controller = require('../../../controller/[module_name]/[module_name].controller');

// IMPORTANT: Static routes FIRST (before dynamic routes)
router.post('/create', authMuatpartsRequired, [moduleName]Validation.create(), [moduleName]Controller.create);
router.get('/list', authMuatpartsRequired, [moduleName]Validation.getList(), [moduleName]Controller.getList);
router.get('/count', authMuatpartsRequired, [moduleName]Validation.getCount(), [moduleName]Controller.getCount);

// Dynamic routes LAST (after static routes)
router.get('/:id', authMuatpartsRequired, [moduleName]Validation.getById(), [moduleName]Controller.getById);
router.put('/:id', authMuatpartsRequired, [moduleName]Validation.update(), [moduleName]Controller.update);
router.delete('/:id', authMuatpartsRequired, [moduleName]Validation.getById(), [moduleName]Controller.delete);

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

### Route Requirements (UPDATED - REAL PATTERN)
- **MANDATORY**: Critical Import Order with Destructuring:
  ```javascript
  // Routes: Destructuring for authMuatpartsRequired
  const express = require('express');
  const router = express.Router();
  const { authMuatpartsRequired } = require('../../../middleware/authentication_muatparts');
  const [moduleName]Validation = require('../../../validation/[module_name]/[module_name].validation');
  const [moduleName]Controller = require('../../../controller/[module_name]/[module_name].controller');
  ```
- **MANDATORY**: Route Organization (CRITICAL):
  ```javascript
  // Static routes FIRST, dynamic routes LAST
  router.post('/create', auth, validation, controller);  // ✅ Static
  router.get('/list', auth, validation, controller);     // ✅ Static  
  router.get('/count', auth, validation, controller);    // ✅ Static
  router.get('/:id', auth, validation, controller);      // ✅ Dynamic LAST
  ```
- **MANDATORY**: Use `authMuatpartsRequired` for protected routes
- **MANDATORY**: Apply validation middleware before controller
- **MANDATORY**: Follow RESTful API design principles
- **MANDATORY**: Add JSDoc comments for each route
- **MANDATORY**: Use appropriate HTTP methods (GET, POST, PUT, DELETE)

## 7. Validation Implementation Pattern (UPDATED - REAL CODEBASE)

```javascript
const { body, param, query } = require('express-validator');
const TimeHelper = require('../../helper/time.helper');

/**
 * Validation rules for [module] operations
 */
class [ModuleName]Validation {
    /**
     * Validation rules for creating [module] (UPDATED)
     * @returns {Array} - Array of validation middleware
     */
    create() {
        return [
            body('name')
                .exists().withMessage('name is required')
                .trim()
                .isLength({ min: 3, max: 100 })
                .withMessage('name must be between 3-100 characters')
                .escape(),
            
            body('description')
                .optional({ checkFalsy: true })
                .trim()
                .isLength({ max: 500 })
                .withMessage('description must not exceed 500 characters')
                .escape(),
            
            body('categoryId')
                .exists().withMessage('categoryId is required')
                .isUUID(4)
                .withMessage('categoryId must be a valid UUID'),
                
            body('status')
                .optional()
                .isIn(['active', 'inactive'])
                .withMessage('status must be either active or inactive'),
                
            // Time validation example (UPDATED - using TimeHelper)
            body('startDate')
                .optional()
                .isISO8601().withMessage('startDate must be a valid ISO 8601 date')
                .custom(value => {
                    const now = TimeHelper.getCurrentTime();
                    const startDate = TimeHelper.parseDate(value);
                    if (startDate < now) {
                        throw new Error('startDate must be in the future');
                    }
                    return true;
                })
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

### Validation Requirements (UPDATED - REAL PATTERN)
- **MANDATORY**: Export instantiated class `new [ModuleName]Validation()`
- **MANDATORY**: Use `exists()` for required fields, `optional()` for optional fields
- **MANDATORY**: Use `optional({ checkFalsy: true })` for fields that can be empty strings
- **MANDATORY**: Always use `trim()` and `escape()` for string inputs
- **MANDATORY**: Use `isUUID(4)` for UUID validation
- **MANDATORY**: Validate date fields using `TimeHelper` for business logic
- **MANDATORY**: Use consistent error messages (lowercase field names)

## 8. Authentication Middleware Pattern (NEW - REAL USAGE)

### Import and Usage:
```javascript
const { authMuatpartsRequired } = require('../../../middleware/authentication_muatparts');

// In routes:
router.post('/create', authMuatpartsRequired, validation, controller);
```

### What `authMuatpartsRequired` Provides:
- **req.user**: Decoded JWT user data (`{ id, role, email, fullName }`)
- **req.userSession**: Database user data (`{ ID, name, phone, Email }`)
- **Automatic 401 responses** for invalid/expired tokens
- **Session validation** against database
- **Multi-role support** (buyer/seller)

### 7-Layer Authentication Validation:
1. **Header Check** - Authorization header exists?
2. **JWT Signature** - Token signature valid with secret?
3. **Database Session** - Token exists in UsersSession table?
4. **Session Expiry** - Session not expired (endSession > now)?
5. **User Existence** - User exists in BfUsers table?
6. **User Status** - User is active (isActive in [0,2])?
7. **Role Validation** - Proper buyer/seller role handling

## 9. Multi-Language Support Pattern (NEW - REAL USAGE)

```javascript
const languageHelper = require('../../helper/language.helper');

// In service methods:
async someMethod(userId, data, languageId = null) {
    if (!languageId) {
        languageId = await languageHelper.getLangSystem();
    }
    
    // Use languageId for translations...
}
```

## 10. Token Usage Pattern (NEW - CONDITIONAL USAGE)

### **When to Include Token Parameter:**
- **Payment processing** (orders, refunds, cancellations)
- **External RPC calls** (payment gateway, third-party services)
- **Service-to-service authentication** forwarding

### **When NOT to Include Token:**
- **Basic CRUD operations** (create, read, update, delete)
- **Internal data processing** (calculations, validations)
- **Database-only operations** (no external calls)

### **Token Strategy Implementation (MANDATORY):**
```javascript
// ❌ DON'T include token for basic CRUD operations
async createCategory(userId, data, languageId = null) {
    // Basic database operation - no token needed
}

// ✅ DO include token for external service calls  
async createOrder(userId, orderData, token, languageId = null) {
    if (orderData.orderType === 'SCHEDULED') {
        await paymentGatewayRpc.createPayment(..., token); // Token needed here
    }
}

// ✅ DO include token for payment operations
async processPayment(userId, orderId, paymentMethodId, token) {
    // Payment gateway integration - token needed
    await paymentGatewayRpc.createPaymentVa(..., token);
}
```

### **Testing Strategy (CONDITIONAL TOKEN):**
```javascript
// ❌ DON'T add token for basic CRUD tests
await service.create(userId, data, languageId);

// ✅ DO add token for external service tests
await service.processPayment(userId, orderId, paymentMethodId, token);
```

## 11. Error Handling Standards

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

## 12. Response Format Standards (UPDATED - REAL EXAMPLES)

### **⚠️ CRITICAL: Actual Response Behavior vs Documentation**

#### **Testing Assertion Patterns (PROVEN SAFE)**

```javascript
// ✅ SAFE: URL assertions (handles query parameters)
expect(response.body.Type).toContain('/v1/endpoint');
expect(response.body.Type).toMatch(/^\/v1\/endpoint/);

// ❌ DANGEROUS: Strict assertion (fails with query params)
expect(response.body.Type).toBe('/v1/endpoint');

// ✅ SAFE: Validation error assertions (express-validator format)
const validationError = response.body.Data.find(err => 
    err.path === 'fieldName' && err.msg === 'fieldName is required'
);
expect(validationError).toBeDefined();

// ❌ DANGEROUS: Wrong property name (use 'path' not 'param')
const error = response.body.Data.find(err => err.param === 'fieldName');
```

#### **Common Testing Pitfalls to Avoid**
1. **URL Assertion Pitfall**: `req.originalUrl` includes query parameters
2. **Validation Error Property**: Use `err.path` NOT `err.param`
3. **Type Field Variability**: Can be 'ERROR' or original URL
4. **Data Field Flexibility**: Can be null or string in error responses

### Success Response
```javascript
return await MessageHelper.showMessage(200, {
    Data: result,
    Type: req.originalUrl  // ⚠️ CRITICAL: Uses req.originalUrl (includes query params!)
}, true, res);
```

### **REAL Response Structure Examples**

#### **✅ Success Response (ACTUAL FORMAT)**
```javascript
// IMPORTANT: Type field includes full URL with query parameters!
{
    "Message": {
        "Code": 200,
        "Text": "OK"
    },
    "Data": {
        // Your response data
        "cargoNames": [...],
        "pagination": {...}
    },
    "Type": "/v1/orders/cargos/names?cargoTypeId=uuid&cargoCategoryId=uuid&search=term&page=1&limit=10"
}

// ⚠️ TESTING IMPLICATION: Use .toContain() NOT .toBe() for Type assertions!
// ✅ CORRECT: expect(response.body.Type).toContain('/v1/orders/cargos/names');
// ❌ WRONG:   expect(response.body.Type).toBe('/v1/orders/cargos/names');
```

#### **✅ Validation Error Response (ACTUAL FORMAT)**
```javascript
// express-validator actual response format
{
    "Message": {
        "Code": 400,
        "Text": "Validation failed"
    },
    "Data": [
        {
            "type": "field",
            "value": "invalid-value",           // Optional: only if value provided
            "msg": "cargoTypeId is required",
            "path": "cargoTypeId",              // ⚠️ CRITICAL: Use 'path' NOT 'param'!
            "location": "query"                 // or "body", "params"
        },
        {
            "type": "field", 
            "msg": "cargoCategoryId must be a valid UUID",
            "path": "cargoCategoryId",          // ⚠️ CRITICAL: Use 'path' NOT 'param'!
            "location": "query"
        }
    ],
    "Type": "ERROR"
}

// ⚠️ TESTING IMPLICATION: Use err.path NOT err.param!
// ✅ CORRECT: const error = response.body.Data.find(err => err.path === 'fieldName');
// ❌ WRONG:   const error = response.body.Data.find(err => err.param === 'fieldName');
```

#### **✅ Service Error Response (ACTUAL FORMAT)**
```javascript
// ResponseError thrown from service layer
{
    "Message": {
        "Code": 400,
        "Text": "Cargo type not found"     // Custom business error message
    },
    "Data": null,                         // Can be null or additional error details
    "Type": "ERROR"
}
```

#### **✅ Server Error Response (ACTUAL FORMAT)**
```javascript
// Unhandled errors caught by error middleware
{
    "Message": {
        "Code": 500,
        "Text": "Internal Server Error"
    },
    "Data": null,
    "Type": "ERROR"
}
```

### **Testing Assertion Patterns (PROVEN SAFE)**

#### **URL Assertions (req.originalUrl behavior)**
```javascript
// ✅ SAFE: Flexible URL assertion (handles query parameters)
expect(response.body.Type).toContain('/v1/orders/cargos/names');
expect(response.body.Type).toMatch(/^\/v1\/orders\/cargos\/names/);

// ❌ DANGEROUS: Strict assertion (will fail with query params)
expect(response.body.Type).toBe('/v1/orders/cargos/names');
```

#### **Validation Error Assertions (express-validator format)**
```javascript
// ✅ SAFE: Using correct property names
const validationError = response.body.Data.find(err => 
    err.path === 'cargoTypeId' && err.msg === 'cargoTypeId is required'
);
expect(validationError).toBeDefined();

// Check multiple validation errors
const errors = response.body.Data;
expect(errors).toBeInstanceOf(Array);
expect(errors.length).toBeGreaterThan(0);
expect(errors.some(err => err.path === 'cargoTypeId')).toBe(true);

// ❌ DANGEROUS: Using wrong property names
const error = response.body.Data.find(err => err.param === 'fieldName'); // WRONG!
```

#### **Success Response Assertions**
```javascript
// ✅ SAFE: Standard success response validation
expect(response.status).toBe(200);
expect(response.body).toHaveProperty('Message');
expect(response.body).toHaveProperty('Data');
expect(response.body).toHaveProperty('Type');

expect(response.body.Message).toMatchObject({
    Code: 200,
    Text: 'OK'
});

// Validate data structure
expect(response.body.Data).toHaveProperty('cargoNames');
expect(response.body.Data).toHaveProperty('pagination');
expect(response.body.Data.cargoNames).toBeInstanceOf(Array);
```

### **⚠️ Common Testing Pitfalls to Avoid**

1. **URL Assertion Pitfall**
   - ❌ `expect(response.body.Type).toBe('/api/endpoint')` - Fails with query params
   - ✅ `expect(response.body.Type).toContain('/api/endpoint')` - Safe approach

2. **Validation Error Property Pitfall** 
   - ❌ `err.param === 'fieldName'` - Wrong property name
   - ✅ `err.path === 'fieldName'` - Correct property name

3. **Response Structure Assumptions**
   - ❌ Assuming error format without verification
   - ✅ Always verify actual response format first with debug script

## 13. Authentication & Authorization

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

## 14. Database Best Practices

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

## 15. Implementation Checklist

### Pre-Implementation
- [ ] Analyze existing similar modules for patterns
- [ ] Identify required database models
- [ ] Plan API endpoints and methods
- [ ] Design validation rules

### During Implementation (UPDATED)
- [ ] Follow naming conventions strictly
- [ ] Implement proper error handling
- [ ] Add comprehensive validation
- [ ] Use database transactions
- [ ] Test authentication integration
- [ ] **Verify model field mappings before coding**
- [ ] **Test with actual validation middleware**
- [ ] **Use flexible response assertions in tests**

### Post-Implementation
- [ ] Test all endpoints manually
- [ ] Verify error responses
- [ ] Check authentication/authorization
- [ ] Review code for security issues
- [ ] Add documentation

## 16. Common Patterns to Follow

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

## 17. Additional Best Practices

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

## 18. Unit Testing Standards (MANDATORY)

### Testing Framework Setup
```javascript
// Required dependencies for testing
const request = require('supertest');
const express = require('express');
const { Op } = require('sequelize');

// Import real models and services (NOT mocks)
const [ModuleName]Service = require('../src/services/[module_name].services');
const MT[ModelName] = require('../src/models/muattrans/[model_name].model');
const MT[ModelName]Translation = require('../src/models/muattrans/[model_name]_translation.model');
const [ModuleName]Controller = require('../src/controller/[module_name].controller');
const languageHelper = require('../src/helper/language.helper');
const MessageHelper = require('../src/helper/message.helper');
const ResponseError = require('../src/error/response-error');

// Import error middleware
const { errorMiddleware } = require('../src/middleware/error-middleware');

// Setup Express app for route testing
const app = express();
app.use(express.json());
app.get('/v1/[module_group]/[module]', [ModuleName]Controller.getList);
app.post('/v1/[module_group]/[module]', [ModuleName]Controller.create); 
app.use(errorMiddleware); 
```

### Standard Structure (5 Layers):
```javascript
describe('[MODULE_NAME] API - Complete Test Suite', () => {
  
  // Jest Hooks - Real Database Cleanup
  beforeEach(async () => {
    jest.clearAllMocks();
    // Real database cleanup dengan UNITTEST pattern
    await [MODEL_NAME]Translation.destroy({ 
      where: { name: { [Op.iLike]: '%UNITTEST%' } }, 
      force: true 
    });
    await [MODEL_NAME].destroy({ 
      where: { name: { [Op.iLike]: '%UNITTEST%' } }, 
      force: true 
    });
  });

  // 1. SERVICE LAYER - Real Database Operations
  describe('1. SERVICE LAYER', () => {
    it('should create with real model', async () => {
      const result = await [MODULE_SERVICE].create(userId, testData);
      expect(result.id).toBeDefined();
    });
  });

  // 2. ROUTE LAYER - HTTP Testing
  describe('2. ROUTE LAYER', () => {
    it('should return 200 with MessageHelper structure', async () => {
      const response = await request(app).get('[API_ENDPOINT]');
      expect(response.body).toHaveProperty('Message');
      expect(response.body).toHaveProperty('Data');
      expect(response.body).toHaveProperty('Type');
    });
  });

  // 3. INTEGRATION LAYER - End-to-End
  describe('3. INTEGRATION LAYER', () => {
    it('should work end-to-end with real translation', async () => {
      // Create data + translation → HTTP request → verify response
    });
  });

  // 4. KO BUSINESS RULES - Compliance Testing
  describe('4. [KO_REFERENCE] BUSINESS RULES', () => {
    it('should support mandatory fields per KO spec', async () => {
      // Test exact KO requirements
    });
  });

  // 5. SECURITY LAYER - Authentication & Validation
  describe('5. SECURITY LAYER', () => {
    it('should prevent SQL injection', async () => {
      // Test dengan malicious input
    });
  });

});
```

### Unit Testing Requirements

#### Test Architecture
- **MANDATORY**: Test ALL layers - Service, Route, Integration, KO Business Rules, and Security
- **MANDATORY**: Use real PostgreSQL models (NOT mocks) for database integration
- **MANDATORY**: Use proper test isolation with beforeEach/afterEach cleanup
- **MANDATORY**: Use UNITTEST prefix for all test data to enable cleanup
- **MANDATORY**: Use valid UUID format for language IDs (not string codes)

#### Test Structure
- **MANDATORY**: 4 test sections: Service Layer, Route Layer, Integration Layer, KO Business Rules
- **MANDATORY**: Both positive (✅) and negative (❌) test cases for each layer
- **MANDATORY**: Proper Jest hooks: beforeAll, beforeEach, afterEach, afterAll
- **MANDATORY**: Test database cleanup using `[Op.iLike]: '%UNITTEST%'` pattern
- **MANDATORY**: Verify cleanup works with `expect(remaining.length).toBe(0)`

#### Database Testing
- **MANDATORY**: Use existing models from `src/models/muattrans/`
- **MANDATORY**: Use existing database connections from `src/config/db.config.js`
- **MANDATORY**: Handle UUID fields correctly (languageID must be UUID, not string)
- **MANDATORY**: Test with real PostgreSQL database (not SQLite or mocks)
- **MANDATORY**: Use `force: true` for hard delete in test cleanup

#### HTTP Response Testing
- **MANDATORY**: Test exact API response structure from MessageHelper
- **MANDATORY**: Verify response has `Message`, `Data`, and `Type` properties
- **MANDATORY**: Test language header handling with UUID values
- **MANDATORY**: Use supertest for HTTP endpoint testing
- **MANDATORY**: Test error responses (400, 404, 500) with proper structure

#### Business Rules Testing
- **MANDATORY**: Create specific test section for KO business rules
- **MANDATORY**: Test all business rules from KO documentation
- **MANDATORY**: Test multi-language support (Indonesian default, English translation)
- **MANDATORY**: Test API contract compliance exactly per specification
- **MANDATORY**: Test mandatory field requirements and UI validation support

#### Test Data Standards
- **MANDATORY**: Prefix all test data with 'UNITTEST' for identification
- **MANDATORY**: Use descriptive test data names (e.g., 'UNITTEST HTTP Test')
- **MANDATORY**: Clean up test data before and after each test
- **MANDATORY**: Verify test data isolation between test runs
- **MANDATORY**: Use realistic test data that matches business requirements

#### Coverage Requirements
- **MANDATORY**: Test service methods with positive and negative cases
- **MANDATORY**: Test HTTP routes with all expected headers and parameters
- **MANDATORY**: Test end-to-end integration from HTTP request to database
- **MANDATORY**: Test all KO business rules and requirements
- **MANDATORY**: Test translation support and fallback mechanisms
- **MANDATORY**: Test error handling and edge cases
- **MANDATORY**: Test security vulnerabilities and attack vectors

#### Security Testing Requirements 
- **MANDATORY**: Test authentication and authorization controls
- **MANDATORY**: Test input validation and sanitization
- **MANDATORY**: Test SQL injection prevention
- **MANDATORY**: Test XSS (Cross-Site Scripting) prevention
- **MANDATORY**: Test unauthorized access attempts
- **MANDATORY**: Test IDOR (Insecure Direct Object Reference) vulnerabilities
- **MANDATORY**: Test data exposure and privacy controls
- **MANDATORY**: Test rate limiting and DOS protection
- **MANDATORY**: Test session management and JWT security


Remember: Security testing must be comprehensive and cover all attack vectors while ensuring data protection, authentication integrity, and compliance with security standards.

#### Database Performance Optimization Requirements
- **MANDATORY**: Use `Promise.all()` for parallel cleanup operations to reduce test execution time
- **MANDATORY**: Set appropriate timeouts for database-heavy operations (minimum 10 seconds)
- **MANDATORY**: Use try-catch blocks for cleanup operations to prevent cascade failures
- **MANDATORY**: Example pattern:
```javascript
beforeEach(async () => {
    try {
        await Promise.all([
            ModelTranslation.destroy({ where: { name: { [Op.iLike]: '%UNITTEST%' } }, force: true }),
            Model.destroy({ where: { name: { [Op.iLike]: '%UNITTEST%' } }, force: true })
        ]);
    } catch (error) {
        // Ignore cleanup errors - database might be empty
    }
}, 10000); // MANDATORY: Increase timeout for database operations
```

#### Foreign Key Constraint Management (CRITICAL FOR TESTING)
- **MANDATORY**: Never use random UUIDs for foreign key fields that must reference existing records
- **MANDATORY**: Always identify required foreign key dependencies before creating test data
- **MANDATORY**: Implement `setupForeignKeyData()` function to query existing records or create minimal required data
- **MANDATORY**: Use existing foreign key IDs in test record creation, not random UUIDs
- **MANDATORY**: Pattern for foreign key setup:
```javascript
// ✅ CORRECT: Setup foreign key data first
async function setupForeignKeyData() {
    try {
        // 1. Get or create parent record (e.g., HeadTruck)
        let headTruck = await MTHeadTruck.findOne({
            where: { isActive: true },
            order: [['createdAt', 'ASC']]
        });
        
        if (!headTruck) {
            headTruck = await MTHeadTruck.create({
                id: uuidv4(),
                className: 'dbmHeadTruck',
                description: 'UNITTEST Head Truck for Testing',
                orderNumber: 1,
                isActive: true
            });
        }
        existingHeadTruckId = headTruck.id;

        // 2. Continue for other dependencies...
        // 3. Create dependent records using existing IDs
        
    } catch (error) {
        console.error('❌ Error setting up foreign key data:', error.message);
        throw error;
    }
}

// ✅ CORRECT: Use existing foreign key IDs
async function createTestOrder() {
    return await MTOrder.create({
        id: testOrderId,
        userID: testUserId,
        truckTypeID: existingTruckTypeId,    // ✅ Use existing ID
        headTruckID: existingHeadTruckId,    // ✅ Use existing ID
        carrierTruckID: existingCarrierTruckId, // ✅ Use existing ID
        // ... other fields
    });
}

// ❌ WRONG: Random UUIDs for foreign keys
async function createTestOrder() {
    return await MTOrder.create({
        truckTypeID: uuidv4(),    // ❌ Random UUID - FK constraint error
        headTruckID: uuidv4(),    // ❌ Random UUID - FK constraint error
        // ... will fail with foreign key constraint violation
    });
}
```
- **MANDATORY**: Call `setupForeignKeyData()` in `beforeAll()` hook before any test execution
- **MANDATORY**: Store foreign key variables at test suite level for reuse across tests
- **MANDATORY**: Document foreign key relationships in comments for future maintainers
- **CRITICAL ERROR RESOLUTION**: When encountering foreign key constraint errors:
  1. Read the error message to identify which foreign key failed
  2. Find the referenced model and table
  3. Query existing records or create minimal required data
  4. Update test data creation to use existing foreign key IDs
  5. Test again and repeat for any remaining foreign key errors

#### Test Path Resolution Standards
- **MANDATORY**: Always verify import paths from test directory structure
- **MANDATORY**: Use correct relative paths based on actual file location
- **MANDATORY**: Pattern: `require('../../../../src/path/to/file')` from `test/api/v1/endpoint/`
- **MANDATORY**: Include validation middleware in route testing setup

#### Response Assertion Flexibility
- **MANDATORY**: Use flexible assertions for response fields that may vary
- **MANDATORY**: Type field can contain original URL or 'ERROR' - test both possibilities
- **MANDATORY**: Data field in error responses can be null or string - accommodate both
- **MANDATORY**: Example patterns:
```javascript
// ✅ CORRECT: Flexible Type field assertion
expect(response.body.Type === 'ERROR' || 
       response.body.Type.includes('/api/endpoint')).toBe(true);

// ✅ CORRECT: Flexible Data field assertion  
expect(response.body.Data === null || 
       typeof response.body.Data === 'string').toBe(true);

// ✅ CORRECT: Flexible error message assertion
expect(response.body.Message.Text).toContain('Not Found'); // Generic message
```

## 19. Testing Environment Configuration

### Express App Setup for Route Testing
```javascript
// MANDATORY: Complete setup pattern
const express = require('express');
const app = express();

// 1. Basic middleware
app.use(express.json());

// 2. Mock authentication (for testing)
app.use((req, res, next) => {
    req.user = { id: 'test-user-id', role: 'shipper' };
    next();
});

// 3. CRITICAL: Include validation middleware
const validation = require('../../../validation/module.validation');
app.get('/endpoint', 
    validation.methodName(),  // ⚠️ MANDATORY for route testing
    controller.methodName
);

// 4. Error middleware (must be last)
app.use(errorMiddleware);
```

### Test Data Consistency Requirements
- **MANDATORY**: Use consistent prefixes for all test data ('UNITTEST')
- **MANDATORY**: Use realistic UUID values, not placeholder strings
- **MANDATORY**: Verify test data creation success before running assertions
- **MANDATORY**: Clean up in correct dependency order (translations → names → categories → types)

## 20. Quick Testing Troubleshooting Guide

### Common Test Failures & Solutions
1. **Import Path Errors**: Check relative paths from test file location
2. **Timeout Errors**: Use `Promise.all()` for cleanup + increase timeout  
3. **Validation Not Working**: Include validation middleware in test setup
4. **Field Name Errors**: Verify with actual model definitions
5. **Response Assertion Failures**: Use flexible patterns, not exact matches
6. **Translation Tests Failing**: Use consistent search terms ('UNITTEST')

### Emergency Debug Commands
```bash
# Find correct import paths
find src -name "*.js" | grep -E "(service|controller|model)"

# Verify model field names  
grep -r "field:" src/models/

# Check validation middleware setup
grep -r "validation" src/routes/
```

### Testing Best Practices Learned from Real Implementation
- **Database Cleanup**: Parallel operations reduce test time from 30s to 10s
- **Path Resolution**: Always count directory levels carefully  
- **Response Testing**: MessageHelper uses `req.originalUrl` which includes query params
- **Error Handling**: Middleware can modify response Type field behavior
- **Field Mapping**: Models use camelCase fields mapped to snake_case database columns

---

**Status:** Enhanced with Real Testing Experience  
**Version:** 3.2 (Testing Standards Update)  
**Compliance:** 100% with existing codebase + proven testing patterns