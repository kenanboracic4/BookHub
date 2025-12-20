const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const UserGenres = sequelize.define("UserGenres", {
    userId: { 
        type: DataTypes.INTEGER,
            allowNull: false
    },
    genreId: { 
        type: DataTypes.INTEGER,
            allowNull: false
    }
}, {
    tableName: "UserGenres",
    timestamps: true
});

module.exports = UserGenres;