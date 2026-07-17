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
    recolteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    marcheId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'OffresVente'
  });

  SaleOffer.associate = (models) => {
    SaleOffer.belongsTo(models.Recolte, { foreignKey: 'recolteId' });
    SaleOffer.belongsTo(models.Market, { foreignKey: 'marcheId' });
  };

  return SaleOffer;
};
