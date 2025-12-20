const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const UserLanguages = sequelize.define("UserLanguages", {
    userId: { 
        type: DataTypes.INTEGER,
        allowNull: false
    },
    languageId: { 
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "UserLanguages",
    timestamps: true
});

module.exports = UserLanguages;