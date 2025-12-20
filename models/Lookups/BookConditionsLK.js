const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const BookConditionsLK = sequelize.define("BookConditionsLK", {
    id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: { 
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "BookConditionsLK",
    timestamps: false
});
module.exports = BookConditionsLK;