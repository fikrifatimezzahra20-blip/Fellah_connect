'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Insert users
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        email: 'admin@fellahconnect.ma',
        motDePasse: hashedPassword,
        role: 'admin',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        email: 'hassan@fellahconnect.ma',
        motDePasse: hashedPassword,
        role: 'agriculteur',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        email: 'brahim@fellahconnect.ma',
        motDePasse: hashedPassword,
        role: 'agriculteur',
        createdAt: now,
        updatedAt: now
      }
    ], {});

    // Insert agriculteurs profiles linked to users
    await queryInterface.bulkInsert('agriculteurs', [
      {
        id: 1,
        nom: 'Hassan El Agriculteur',
        telephone: '0622334455',
        region: 'Souss-Massa',
        userId: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        nom: 'Brahim Le Releveur',
        telephone: '0633445566',
        region: 'Chaouia',
        userId: 3,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('agriculteurs', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
