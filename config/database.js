const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('fella_db', 'postgres', 'ton_mot_de_passe', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, 
});

module.exports = sequelize;