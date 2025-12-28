const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");


const UserRating = sequelize.define('UserRating', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    
    raterId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = UserRating;