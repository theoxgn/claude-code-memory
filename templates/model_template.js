const { Model, DataTypes } = require('sequelize');
const { dbMuatTrans } = require('..');

/**
 * MTProduct Model - Represents products in the MuatTrans system
 * @class MTProduct
 * @extends Model
 */
class MTProduct extends Model {}

MTProduct.init({
    // Primary key
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'id'
    },

    // Basic product information
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

    sku: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'sku'
    },

    // Pricing information
    price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'price'
    },

    // Inventory information
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'stock'
    },

    // Physical properties
    weight: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
        field: 'weight'
    },

    // Classification
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'category_id'
    },

    // Status
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
        field: 'status'
    },

    isVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_visible'
    },

    // Timestamps (explicitly defined with field mapping)
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
    // Model options
    sequelize: dbMuatTrans,
    modelName: 'MTProduct',
    tableName: 'dbm_mt_product', // Master table prefix
    timestamps: true,
    paranoid: true // Enable soft deletes
});

// Inline associations (import related models after model definition)
const MTUser = require('./user.model');
const MTCategory = require('./category.model');

// Define associations directly
MTProduct.belongsTo(MTUser, {
    as: 'creator',
    foreignKey: 'createdBy',
    onDelete: 'SET NULL'
});

MTProduct.belongsTo(MTCategory, {
    as: 'category',
    foreignKey: 'categoryId',
    onDelete: 'RESTRICT'
});

// Reverse associations if needed
MTCategory.hasMany(MTProduct, {
    as: 'products',
    foreignKey: 'categoryId',
    onDelete: 'RESTRICT'
});

module.exports = MTProduct;