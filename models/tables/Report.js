const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Report = sequelize.define("Report", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    reporterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Korisnik koji šalje prijavu"
    },
    type: {
        type: DataTypes.ENUM("KORISNIK", "KNJIGA"),
        allowNull: false,
    },
    targetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM("NA ČEKANJU", "RIJEŠENO", "ODBIJENO"),
        defaultValue: "NA ČEKANJU",
    }
}, {
    tableName: "reports",
    timestamps: true
});

module.exports = Report;