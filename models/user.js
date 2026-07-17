'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Agriculteur, {
        foreignKey: 'userId',
        as: 'agriculteur',
        onDelete: 'CASCADE'
      });
    }

    toSafeJSON() {
      const { id, email, role, createdAt } = this;
      return { id, email, role, createdAt };
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: { isEmail: true },
      },
      motDePasse: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('agriculteur', 'admin'),
        allowNull: false,
        defaultValue: 'agriculteur',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
    }
  );

  return User;
};
