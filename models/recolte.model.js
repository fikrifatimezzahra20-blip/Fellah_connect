'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recolte extends Model {
    static associate(models) {
      Recolte.belongsTo(models.Utilisateur, {
        foreignKey: 'utilisateurId',
        as: 'agriculteur',
      });
      Recolte.belongsTo(models.Parcelle, {
        foreignKey: 'parcelleId',
        as: 'parcelle',
      });
      Recolte.belongsTo(models.Produit, {
        foreignKey: 'produitId',
        as: 'produitRef',
      });
      Recolte.hasMany(models.OffreVente, {
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
        validate: { min: 0 },
      },
      produit: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Inconnu',
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
      utilisateurId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      prixSouhaite: {
        type: DataTypes.FLOAT,
        allowNull: true,
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
