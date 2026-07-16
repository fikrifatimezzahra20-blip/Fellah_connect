'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    static associate(models) {
    }

    toSafeJSON() {
      const { id, nom, telephone, email, role, region, createdAt } = this;
      return { id, nom, telephone, email, role, region, createdAt };
    }
  }

  Utilisateur.init(
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
        validate: { notEmpty: true },
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
      region: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Utilisateur',
      tableName: 'utilisateurs',
      timestamps: true,
    }
  );

  return Utilisateur;
};
