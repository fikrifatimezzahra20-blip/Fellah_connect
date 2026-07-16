'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email='hassan@fellahconnect.ma';`
    );
    const userId = users[0][0].id;
    const now = new Date();

    await queryInterface.bulkInsert('Parcelles', [
      {
        name: 'Ferme Souss',
        area: 5.5,
        municipality: 'Souss-Massa',
        userId: userId,
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Terre Chaouia',
        area: 12.0,
        municipality: 'Chaouia',
        userId: userId,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Parcelles', null, {});
  }
};
