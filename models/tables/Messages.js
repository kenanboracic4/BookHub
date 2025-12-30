const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Message = sequelize.define("Message", { 
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
  
    conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
   
    content: { 
        type: DataTypes.TEXT,
        allowNull: false
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: "Messages",
    timestamps: true 
});

module.exports = Message;