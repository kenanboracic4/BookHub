const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const GenresLK = sequelize.define("GenresLK", {
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
    tableName: "GenresLK",
    timestamps: false
});
module.exports = GenresLK;