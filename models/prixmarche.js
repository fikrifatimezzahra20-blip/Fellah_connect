const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MarketPrice = sequelize.define('MarketPrice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pricePerKg: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    priceDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    marketId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  MarketPrice.associate = (models) => {
    MarketPrice.belongsTo(models.Market, { foreignKey: 'marketId' });
    MarketPrice.belongsTo(models.Product, { foreignKey: 'productId' });
  };

  return MarketPrice;
};
