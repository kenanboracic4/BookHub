const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const BookRating = sequelize.define("BookRating", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    value: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT, 
        allowNull: true       
    }
}, { 
    tableName: "BookRatings", 
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'bookId'] 
        }
    ]
});

module.exports = BookRating;