const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Recolte = sequelize.define('Recolte', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    harvestDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('READY', 'SOLD'),
      allowNull: false
    },
    parcelleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    produitId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'Recoltes'
  });

  Recolte.associate = (models) => {
    Recolte.belongsTo(models.Parcelle, { foreignKey: 'parcelleId' });
    Recolte.belongsTo(models.Product, { foreignKey: 'produitId' });
    Recolte.hasMany(models.SaleOffer, { foreignKey: 'recolteId' });
  };

  return Recolte;
};
