'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Marches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      region: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('Marches', ['createdAt'], {
      name: 'idx_marches_created_at'
    });
    await queryInterface.addIndex('Marches', ['updatedAt'], {
      name: 'idx_marches_updated_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Marches');
  }
};
