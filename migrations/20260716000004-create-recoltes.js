'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recoltes', {
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
      harvestDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('READY', 'SOLD'),
        allowNull: false
      },
      parcelleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Parcelles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      produitId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Produits',
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

    await queryInterface.addIndex('Recoltes', ['parcelleId'], {
      name: 'idx_recoltes_parcelle_id'
    });
    await queryInterface.addIndex('Recoltes', ['produitId'], {
      name: 'idx_recoltes_produit_id'
    });
    await queryInterface.addIndex('Recoltes', ['harvestDate'], {
      name: 'idx_recoltes_harvest_date'
    });
    await queryInterface.addIndex('Recoltes', ['createdAt'], {
      name: 'idx_recoltes_created_at'
    });
    await queryInterface.addIndex('Recoltes', ['updatedAt'], {
      name: 'idx_recoltes_updated_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Recoltes');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Recoltes_status";');
  }
};
