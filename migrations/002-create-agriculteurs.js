'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agriculteurs', {
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
      region: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
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

    await queryInterface.addIndex('agriculteurs', ['telephone'], {
      unique: true,
      name: 'idx_agriculteurs_telephone',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('agriculteurs');
  },
};
