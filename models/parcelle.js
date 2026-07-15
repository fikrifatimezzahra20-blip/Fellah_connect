const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Parcelle = sequelize.define('Parcelle', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    area: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    municipality: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  Parcelle.associate = (models) => {
    Parcelle.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Parcelle;
};
