'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Parcelles', {
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
      area: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      municipality: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    await queryInterface.addIndex('Parcelles', ['userId'], {
      name: 'idx_parcelles_user_id'
    });
    await queryInterface.addIndex('Parcelles', ['createdAt'], {
      name: 'idx_parcelles_created_at'
    });
    await queryInterface.addIndex('Parcelles', ['updatedAt'], {
      name: 'idx_parcelles_updated_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Parcelles');
  }
};
