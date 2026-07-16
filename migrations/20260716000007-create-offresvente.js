'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OffresVente', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      askingPrice: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('OPEN', 'ACCEPTED', 'CLOSED'),
        allowNull: false
      },
      harvestId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Recoltes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      marketId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Marches',
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

    await queryInterface.addIndex('OffresVente', ['harvestId'], {
      name: 'idx_offresvente_harvest_id'
    });
    await queryInterface.addIndex('OffresVente', ['marketId'], {
      name: 'idx_offresvente_market_id'
    });
    await queryInterface.addIndex('OffresVente', ['createdAt'], {
      name: 'idx_offresvente_created_at'
    });
    await queryInterface.addIndex('OffresVente', ['updatedAt'], {
      name: 'idx_offresvente_updated_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OffresVente');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_OffresVente_status";');
  }
};
