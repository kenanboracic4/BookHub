const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Conversation = sequelize.define("Conversation", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "Conversations",
    timestamps: true
});

module.exports = Conversation;