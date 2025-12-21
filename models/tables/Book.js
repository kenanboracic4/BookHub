const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

console.log("Proba");

const Book = sequelize.define("Book", {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    title: { 
        type: DataTypes.STRING, 
        allowNull: false
     },
    author: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT
     },
    price: { 
        type: DataTypes.DECIMAL(10, 2),
         defaultValue: 0.00,
         validate  : {
            min: 0
         }
        },
    isForExchange: {
         type: DataTypes.BOOLEAN, 
         defaultValue: false },
    status: { 
        type: DataTypes.ENUM('active', 'reserved', 'sold', 'archived'), 
        defaultValue: 'active' 
    },
    imageUrl: { 
        type: DataTypes.STRING 
    
    },
    sellerId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    genreId: { 
        type: DataTypes.INTEGER 
    
    },
    languageId: { 
        type: DataTypes.INTEGER 
    },
    conditionId: { 
        type: DataTypes.INTEGER 
    },
    locationId: { 
        type: DataTypes.INTEGER 
    },


    // Statistika
    viewCount: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },
    averageRating: {
         type: DataTypes.FLOAT,
          defaultValue: 0 
        },
    ratingCount: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },
    ordersCount: {
         type: DataTypes.INTEGER, 
         defaultValue: 0
         }
    }, { 
        tableName: "Books", 
        timestamps: true 
    });

module.exports = Book;