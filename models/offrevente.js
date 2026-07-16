const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SaleOffer = sequelize.define('SaleOffer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    askingPrice: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'ACCEPTED', 'CLOSED'),
      allowNull: false
    },
    harvestId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    marketId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  SaleOffer.associate = (models) => {
    SaleOffer.belongsTo(models.Recolte, { foreignKey: 'harvestId' });
    SaleOffer.belongsTo(models.Market, { foreignKey: 'marketId' });
  };

  return SaleOffer;
};
