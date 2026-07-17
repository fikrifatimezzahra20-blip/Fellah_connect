'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Agriculteur extends Model {
    static associate(models) {
      Agriculteur.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE'
      });
      Agriculteur.hasMany(models.Parcelle, {
        foreignKey: 'agriculteurId',
        as: 'parcelles',
      });
      Agriculteur.hasMany(models.Recolte, {
        foreignKey: 'agriculteurId',
        as: 'recoltes',
      });
    }
  }

  Agriculteur.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Agriculteur',
      tableName: 'agriculteurs',
      timestamps: true,
    }
  );

  return Agriculteur;
};
