'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "utilisateurs" WHERE email='hassan@fellahconnect.ma';`
    );
    const utilisateurId = users[0][0].id;
    const now = new Date();

    await queryInterface.bulkInsert('parcelles', [
      {
        nom: 'Ferme Souss',
        superficie: 5.5,
        commune: 'Souss-Massa',
        utilisateurId: utilisateurId,
        createdAt: now,
        updatedAt: now
      },
      {
        nom: 'Terre Chaouia',
        superficie: 12.0,
        commune: 'Chaouia',
        utilisateurId: utilisateurId,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('parcelles', null, {});
  }
};
