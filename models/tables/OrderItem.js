const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const OrderItem = sequelize.define("OrderItem", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: { 
        type: DataTypes.INTEGER, 
        allowNull: false    
    },
    bookId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    priceAtPurchase: { 
        type: DataTypes.DECIMAL(10, 2)
     } 
}, { 
    tableName: "OrderItems",
     timestamps: false 
    }
);
module.exports = OrderItem;