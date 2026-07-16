'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('offres_vente', {
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
        references: { model: 'recoltes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      marcheId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'marches', key: 'id' },
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

    await queryInterface.addIndex('offres_vente', ['recolteId'], {
      name: 'idx_offres_recolte',
    });
    await queryInterface.addIndex('offres_vente', ['marcheId'], {
      name: 'idx_offres_marche',
    });
    await queryInterface.addIndex('offres_vente', ['statut'], {
      name: 'idx_offres_statut',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('offres_vente');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_offres_vente_statut";'
    );
  },
};
