const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Market = sequelize.define('Market', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'Marches'
  });

  Market.associate = (models) => {
    Market.hasMany(models.MarketPrice, { foreignKey: 'marcheId' });
    Market.hasMany(models.SaleOffer, { foreignKey: 'marcheId' });
  };

  return Market;
};
