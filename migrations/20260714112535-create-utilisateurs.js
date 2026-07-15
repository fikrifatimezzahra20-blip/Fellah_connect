'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('utilisateurs', {
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
      telephone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      motDePasse: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('agriculteur', 'admin'),
        allowNull: false,
        defaultValue: 'agriculteur',
      },
      region: {
        type: Sequelize.STRING,
        allowNull: true,
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

    await queryInterface.addIndex('utilisateurs', ['telephone'], {
      unique: true,
      name: 'idx_utilisateurs_telephone',
    });

    await queryInterface.addIndex('utilisateurs', ['role'], {
      name: 'idx_utilisateurs_role',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('utilisateurs');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_utilisateurs_role";'
    );
  },
};
