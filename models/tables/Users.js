const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");


const User = sequelize.define("Users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Prodavač', 'Kupac','Admin'),
        allowNull: false,
        defaultValue: 'Kupac'
    },
    status: {
        type: DataTypes.ENUM('Aktivan', 'Blokiran', 'Arhiviran'),
        defaultValue: 'Aktivan'
    },
    blockExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true 
    },
    averageRating: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    locationId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: "Users",
    timestamps: true

});
module.exports = User;