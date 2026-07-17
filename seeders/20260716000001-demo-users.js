'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('utilisateurs', [
      {
        nom: 'Admin Manager',
        telephone: '0611223344',
        email: 'admin@fellahconnect.ma',
        motDePasse: hashedPassword,
        role: 'admin',
        region: 'Rabat-Salé-Kénitra',
        createdAt: now,
        updatedAt: now
      },
      {
        nom: 'Hassan El Agriculteur',
        telephone: '0622334455',
        email: 'hassan@fellahconnect.ma',
        motDePasse: hashedPassword,
        role: 'agriculteur',
        region: 'Souss-Massa',
        createdAt: now,
        updatedAt: now
      },
      {
        nom: 'Brahim Le Releveur',
        telephone: '0633445566',
        email: 'brahim@fellahconnect.ma',
        motDePasse: hashedPassword,
        role: 'agriculteur',
        region: 'Chaouia',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('utilisateurs', null, {});
  }
};
