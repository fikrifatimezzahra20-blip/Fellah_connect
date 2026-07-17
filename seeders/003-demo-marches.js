'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('marches', [
      { id: 1, nom: 'Souk Inezgane', ville: 'Inezgane', region: 'Souss-Massa', createdAt: now, updatedAt: now },
      { id: 2, nom: 'Marché de Gros Kenitra', ville: 'Kenitra', region: 'Gharb', createdAt: now, updatedAt: now },
      { id: 3, nom: 'Souk Settat', ville: 'Settat', region: 'Chaouia', createdAt: now, updatedAt: now },
      { id: 4, nom: 'Marché de Gros Marrakech', ville: 'Marrakech', region: 'Haouz', createdAt: now, updatedAt: now },
      { id: 5, nom: 'Souk Béni Mellal', ville: 'Béni Mellal', region: 'Béni Mellal-Khénifra', createdAt: now, updatedAt: now }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('marches', null, {});
  }
};
