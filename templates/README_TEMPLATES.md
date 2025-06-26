# Backend Development Templates

This directory contains production-ready templates for implementing Node.js/Express backend features following the established project patterns.

## Template Files

### 1. Controller Template (`controller_template.js`)
**Purpose**: HTTP request handling layer
**Features**:
- Complete CRUD operations (Create, Read, Update, Delete)
- Additional operations (Stats, Bulk Update)
- Proper error handling with try-catch
- Input validation using express-validator
- Authentication integration
- Standardized response format using MessageHelper

**Key Methods**:
- `create()` - POST endpoint for creating new records
- `getList()` - GET endpoint with pagination and filtering
- `getById()` - GET endpoint for single record
- `update()` - PUT endpoint for updating records
- `delete()` - DELETE endpoint for soft delete
- `getStats()` - GET endpoint for statistics
- `bulkUpdate()` - PATCH endpoint for bulk operations

### 2. Service Template (`service_template.js`)
**Purpose**: Business logic layer
**Features**:
- Database transaction management
- Complex business logic validation
- Comprehensive error handling
- Data formatting and transformation
- Performance optimized queries
- Relationship management

**Key Methods**:
- `create()` - Business logic for record creation
- `getList()` - Paginated data retrieval with filtering
- `getById()` - Single record retrieval
- `update()` - Record update with validation
- `delete()` - Soft delete with business rules
- `getStats()` - Statistical data aggregation
- `bulkUpdate()` - Bulk operation handling

**Helper Methods**:
- `buildWhereClause()` - Dynamic filtering
- `getIncludes()` - Relationship definitions
- `formatResponse()` - Data formatting
- `validateBusinessRules()` - Business validation
- `validateDeletion()` - Deletion rules

### 3. Route Template (`routes_template.js`)
**Purpose**: API endpoint definitions
**Features**:
- RESTful API design
- Middleware chaining (Auth → Validation → Controller)
- Comprehensive route documentation
- Proper HTTP methods and status codes
- Security middleware integration

**Endpoints**:
- `POST /` - Create new record
- `GET /` - List records with pagination
- `GET /stats` - Get statistics
- `GET /:id` - Get single record
- `PUT /:id` - Update record
- `PATCH /bulk` - Bulk update
- `DELETE /:id` - Delete record

### 4. Validation Template (`validation_template.js`)
**Purpose**: Input validation and sanitization
**Features**:
- express-validator implementation
- Comprehensive validation rules
- Input sanitization (XSS prevention)
- Custom validation logic
- Descriptive error messages
- Type conversion and formatting

**Validation Methods**:
- `create()` - Create operation validation
- `update()` - Update operation validation
- `getList()` - Query parameter validation
- `getById()` - Path parameter validation
- `delete()` - Delete parameter validation
- `getStats()` - Statistics query validation
- `bulkUpdate()` - Bulk operation validation
- `search()` - Advanced search validation

### 5. Model Template (`model_template.js`)
**Purpose**: Database model definition
**Features**:
- Complete Sequelize model with all standard fields
- Association definitions
- Instance and static methods
- Validation rules and constraints
- Hooks for automatic operations
- Indexes for performance
- Scopes for common queries

**Model Features**:
- UUID primary keys
- Audit fields (createdBy, updatedBy, deletedBy)
- Soft delete support (paranoid)
- JSONB fields for flexible data
- Comprehensive validation
- SEO-friendly features
- Performance indexes

## Usage Instructions

### 1. Choose Your Module Name
Replace placeholders in templates:
- `[ModuleName]` → Your class name (e.g., `Product`)
- `[moduleName]` → camelCase instance (e.g., `product`)
- `[module_name]` → snake_case file name (e.g., `product`)
- `[module]` → lowercase (e.g., `product`)

### 2. File Naming Convention
```
src/
├── controller/
│   └── product_controller.js
├── services/
│   └── product_service.js
├── routes/
│   └── v1/products/
│       └── product_routes.js
├── validation/
│   └── product_validation.js
└── models/muattrans/
    └── product.model.js
```

### 3. Implementation Steps

#### Step 1: Create Model
1. Copy `model_template.js` to `src/models/muattrans/product.model.js`
2. Replace `MTProduct` with your model name
3. Update table name and fields as needed
4. Define associations
5. Add to model index file

#### Step 2: Create Service
1. Copy `service_template.js` to `src/services/product_service.js`
2. Replace `ProductService` with your service name
3. Import your model
4. Implement business logic
5. Update validation methods

#### Step 3: Create Validation
1. Copy `validation_template.js` to `src/validation/product_validation.js`
2. Replace `ProductValidation` with your validation name
3. Update validation rules for your fields
4. Add custom validators as needed

#### Step 4: Create Controller
1. Copy `controller_template.js` to `src/controller/product_controller.js`
2. Replace `ProductController` with your controller name
3. Import your service and validation
4. Update response types

#### Step 5: Create Routes
1. Copy `routes_template.js` to `src/routes/v1/products/product_routes.js`
2. Replace route paths and names
3. Import your controller and validation
4. Add to main router

### 4. Customization Guidelines

#### Common Customizations:
- **Fields**: Add/remove fields in model and validation
- **Business Logic**: Update service validation methods
- **Endpoints**: Add specialized endpoints in controller/routes
- **Relationships**: Define associations in model
- **Permissions**: Add role-based access control
- **Caching**: Implement Redis caching in service layer

#### Security Considerations:
- Always validate input with express-validator
- Use parameterized queries (ORM handles this)
- Implement proper authentication
- Add rate limiting for sensitive operations
- Log security events

### 5. Testing Your Implementation

#### Manual Testing Checklist:
- [ ] Create endpoint works with valid data
- [ ] Create endpoint rejects invalid data
- [ ] List endpoint returns paginated results
- [ ] List endpoint filters work correctly
- [ ] Get by ID returns correct record
- [ ] Get by ID returns 404 for non-existent records
- [ ] Update endpoint modifies records
- [ ] Update endpoint validates input
- [ ] Delete endpoint performs soft delete
- [ ] Authentication is required for all endpoints
- [ ] Error responses are properly formatted

#### Performance Testing:
- [ ] Large dataset pagination performance
- [ ] Search functionality with indexes
- [ ] Bulk operations efficiency
- [ ] Database connection pooling
- [ ] Memory usage under load

## Best Practices

### 1. Error Handling
```javascript
// Always use ResponseError for business logic errors
throw new ResponseError(400, 'Business rule violation');

// Always use try-catch in controllers
try {
    const result = await service.method();
    return response;
} catch (error) {
    next(error); // Pass to error middleware
}
```

### 2. Database Transactions
```javascript
// Use transactions for multiple operations
const transaction = await dbMuatTrans.transaction();
try {
    // Multiple database operations
    await transaction.commit();
} catch (error) {
    await transaction.rollback();
    throw error;
}
```

### 3. Validation
```javascript
// Always validate and sanitize input
body('name')
    .trim()           // Remove whitespace
    .escape()         // Prevent XSS
    .notEmpty()       // Required validation
    .isLength({min: 3, max: 100}) // Length validation
```

### 4. Response Format
```javascript
// Use consistent response format
return await MessageHelper.showMessage(200, {
    Data: result,
    Type: "MODULE_OPERATION"
}, true, res);
```

## Troubleshooting

### Common Issues:

1. **Validation Errors**: Check express-validator syntax and field names
2. **Database Errors**: Verify model associations and field mappings
3. **Authentication Issues**: Ensure middleware is properly applied
4. **Route Conflicts**: Check route order (specific routes before parameterized)
5. **Import Errors**: Verify file paths and exports

### Debug Tips:

1. Use `console.log()` in development for debugging
2. Check database logs for SQL errors
3. Test validation rules individually
4. Verify middleware order in routes
5. Use Postman or similar tools for API testing

## Support

For questions or issues with these templates:
1. Check the main project documentation
2. Review existing implementations in the codebase
3. Follow the established patterns and conventions
4. Test thoroughly before deployment

Remember: These templates are starting points. Always customize them according to your specific business requirements while maintaining the established patterns and security standards.