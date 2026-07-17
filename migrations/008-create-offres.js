'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('offres', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      quantite: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      prixDemande: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      statut: {
        type: Sequelize.ENUM('ouverte', 'acceptee', 'fermee'),
        allowNull: false,
        defaultValue: 'ouverte',
      },
      recolteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'recoltes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      marcheId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'marches',
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

    await queryInterface.addIndex('offres', ['statut'], {
      name: 'idx_offres_statut',
    });

    await queryInterface.addIndex('offres', ['recolteId'], {
      name: 'idx_offres_recolte_id',
    });

    await queryInterface.addIndex('offres', ['marcheId'], {
      name: 'idx_offres_marche_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('offres');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_offres_statut";'
    );
  },
};
