const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const LocationsLK = sequelize.define("LocationsLK", {
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
    tableName: "LocationsLK",
    timestamps: false
});
module.exports = LocationsLK;