const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Notification = sequelize.define("Notification", {
    id: { 
        type: DataTypes.INTEGER,
         primaryKey: true,
          autoIncrement: true 
        },
    userId: {  // Osoba kojoj ide
         type: DataTypes.INTEGER,
          allowNull: false 
        },
    senderId: {
         type: DataTypes.INTEGER, 
         allowNull: true
         }, 
    type: { 
        type: DataTypes.ENUM('Narudžba', 'Ocjena', 'Poruka'),
        allowNull: false 
    },
    content: { 
        type: DataTypes.STRING, 
        allowNull: false
     }, 
    link: {
         type: DataTypes.STRING 
        }, 
    isRead: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false
     }
}, { 
    timestamps: true
 });
 module.exports = Notification;