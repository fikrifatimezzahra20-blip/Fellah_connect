const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'Produits'
  });

  Product.associate = (models) => {
    Product.hasMany(models.Recolte, { foreignKey: 'produitId' });
    Product.hasMany(models.MarketPrice, { foreignKey: 'produitId' });
  };

  return Product;
};
