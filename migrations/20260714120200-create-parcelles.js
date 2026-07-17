'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parcelles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      superficie: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      commune: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      utilisateurId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'utilisateurs', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('parcelles', ['utilisateurId'], {
      name: 'idx_parcelles_utilisateur',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('parcelles');
  },
};
