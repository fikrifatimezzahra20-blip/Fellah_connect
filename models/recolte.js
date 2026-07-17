'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recolte extends Model {
    static associate(models) {
      Recolte.belongsTo(models.Agriculteur, {
        foreignKey: 'agriculteurId',
        as: 'agriculteur',
        onDelete: 'CASCADE'
      });
      Recolte.belongsTo(models.Parcelle, {
        foreignKey: 'parcelleId',
        as: 'parcelle',
        onDelete: 'SET NULL'
      });
      Recolte.belongsTo(models.Produit, {
        foreignKey: 'produitId',
        as: 'produitRef',
        onDelete: 'SET NULL'
      });
      Recolte.hasMany(models.Offre, {
        foreignKey: 'recolteId',
        as: 'offres',
      });
    }
  }

  Recolte.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quantiteKg: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0.1 },
      },
      dateRecolte: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      statut: {
        type: DataTypes.ENUM('en_attente', 'disponible', 'vendue'),
        allowNull: false,
        defaultValue: 'en_attente',
      },
      parcelleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      produitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      produit: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Inconnu',
      },
      prixSouhaite: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: { min: 0.1 },
      },
      agriculteurId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Recolte',
      tableName: 'recoltes',
      timestamps: true,
    }
  );

  return Recolte;
};
