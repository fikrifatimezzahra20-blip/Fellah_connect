'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('Marches', [
      { name: 'Souk Inezgane', city: 'Inezgane', region: 'Souss-Massa', createdAt: now, updatedAt: now },
      { name: 'Marché de Gros Kenitra', city: 'Kenitra', region: 'Gharb', createdAt: now, updatedAt: now },
      { name: 'Souk Settat', city: 'Settat', region: 'Chaouia', createdAt: now, updatedAt: now }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Marches', null, {});
  }
};
