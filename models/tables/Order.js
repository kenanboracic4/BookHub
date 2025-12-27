const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Order = sequelize.define("Order", {
    id: { 
        type: DataTypes.INTEGER,
         primaryKey: true, 
         autoIncrement: true 
        },
    buyerId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    sellerId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    orderType: { 
        type: DataTypes.ENUM('PRODAJA', 'ZAMJENA'), 
        allowNull: false
     },
    status: { 
       type: DataTypes.ENUM('NA ČEKANJU', 'PRIHVAĆENO', 'ODBIJENO', 'OTKAZANO'),
        defaultValue: 'NA ČEKANJU' 
    },
    exchangeItemDetails: { // Opis knjige koja se nudi u zamjenu
        type: DataTypes.TEXT 
    },
    totalPrice: {
         type: DataTypes.DECIMAL(10, 2)
     }
}, { 
    tableName: "Orders",
     timestamps: true 
    }
);
module.exports = Order;