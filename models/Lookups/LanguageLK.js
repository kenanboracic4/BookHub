const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const LanguageLK = sequelize.define("LanguageLK", {
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
    tableName: "LanguageLK",
    timestamps: false
});
module.exports = LanguageLK;