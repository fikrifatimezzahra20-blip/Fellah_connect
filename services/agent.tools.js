'use strict';

const { Recolte, Parcelle, PrixMarche, OffreVente, Marche } = require('../models');
const { Op } = require('sequelize');

// ──────────────────────────────────────────────────────────────
// Tool definitions (OpenAI-compatible function calling schema)
// ──────────────────────────────────────────────────────────────

const TOOL_DEFINITIONS = [
  {
    type: 'function',
    function: {
      name: 'obtenir_mes_recoltes',
      description:
        "Retourne la liste des recoltes de l'utilisateur connecte, avec statut optionnel.",
      parameters: {
        type: 'object',
        properties: {
          statut: {
            type: 'string',
            enum: ['en_attente', 'disponible', 'vendue'],
            description: 'Filtrer par statut (optionnel).',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'creer_recolte',
      description:
        "Enregistre une nouvelle recolte pour l'utilisateur connecte. Demander confirmation avant.",
      parameters: {
        type: 'object',
        properties: {
          produit: {
            type: 'string',
            description: 'Nom du produit (ex: tomate, pomme de terre).',
          },
          quantiteKg: {
            type: 'number',
            description: 'Quantite en kilogrammes.',
          },
          parcelleId: {
            type: 'integer',
            description: "ID de la parcelle (optionnel).",
          },
          confirmation: {
            type: 'boolean',
            description: "true si l'utilisateur a confirme l'action.",
          },
        },
        required: ['produit', 'quantiteKg', 'confirmation'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'obtenir_meilleur_prix',
      description:
        'Trouve le marche avec le meilleur prix pour un produit donne.',
      parameters: {
        type: 'object',
        properties: {
          produit: {
            type: 'string',
            description: 'Nom du produit a chercher.',
          },
        },
        required: ['produit'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'publier_offre_vente',
      description:
        "Publie une offre de vente pour une recolte sur un marche. Demander confirmation avant.",
      parameters: {
        type: 'object',
        properties: {
          recolteId: {
            type: 'integer',
            description: 'ID de la recolte a vendre.',
          },
          marcheId: {
            type: 'integer',
            description: 'ID du marche cible.',
          },
          quantite: {
            type: 'number',
            description: 'Quantite a vendre en kg.',
          },
          prixDemande: {
            type: 'number',
            description: 'Prix demande en DH/kg.',
          },
          confirmation: {
            type: 'boolean',
            description: "true si l'utilisateur a confirme l'action.",
          },
        },
        required: ['recolteId', 'marcheId', 'quantite', 'prixDemande', 'confirmation'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'obtenir_mes_parcelles',
      description:
        "Retourne la liste des parcelles de l'utilisateur connecte.",
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'obtenir_prix_marche',
      description:
        'Consulte les prix du marche pour un produit, avec filtres optionnels.',
      parameters: {
        type: 'object',
        properties: {
          produit: {
            type: 'string',
            description: 'Nom du produit.',
          },
          marche: {
            type: 'string',
            description: 'Nom du marche (optionnel).',
          },
        },
        required: ['produit'],
      },
    },
  },
];

// ──────────────────────────────────────────────────────────────
// Tool handlers — each returns a JSON-serializable result
// ──────────────────────────────────────────────────────────────

async function handle_obtenir_mes_recoltes(args, user) {
  const where = { utilisateurId: user.id };
  if (args.statut) {
    where.statut = args.statut;
  }

  const recoltes = await Recolte.findAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: 20,
  });

  if (recoltes.length === 0) {
    return { trouve: false, message: 'Aucune recolte trouvee.' };
  }

  return {
    trouve: true,
    total: recoltes.length,
    recoltes: recoltes.map((r) => ({
      id: r.id,
      produit: r.produit,
      quantiteKg: r.quantiteKg,
      statut: r.statut,
      dateRecolte: r.dateRecolte,
      prixSouhaite: r.prixSouhaite,
    })),
  };
}

async function handle_creer_recolte(args, user) {
  if (!args.confirmation) {
    return {
      succes: false,
      message: "L'utilisateur n'a pas confirme. Demandez confirmation d'abord.",
    };
  }

  // If parcelleId is provided, verify ownership
  if (args.parcelleId) {
    const parcelle = await Parcelle.findByPk(args.parcelleId);
    if (!parcelle || parcelle.utilisateurId !== user.id) {
      return {
        succes: false,
        message: "Cette parcelle n'appartient pas a cet utilisateur.",
      };
    }
  }

  const recolte = await Recolte.create({
    produit: args.produit,
    quantiteKg: args.quantiteKg,
    dateRecolte: new Date(),
    statut: 'en_attente',
    parcelleId: args.parcelleId || null,
    utilisateurId: user.id,
  });

  return {
    succes: true,
    recolte: {
      id: recolte.id,
      produit: recolte.produit,
      quantiteKg: recolte.quantiteKg,
      statut: recolte.statut,
    },
  };
}

async function handle_obtenir_meilleur_prix(args) {
  const meilleur = await PrixMarche.findOne({
    where: {
      produit: { [Op.iLike]: `%${args.produit}%` },
    },
    order: [['prix', 'DESC']],
  });

  if (!meilleur) {
    return {
      trouve: false,
      message: `Aucun prix trouve pour "${args.produit}".`,
    };
  }

  return {
    trouve: true,
    produit: meilleur.produit,
    marche: meilleur.marche,
    prix: meilleur.prix,
    unite: meilleur.unite,
    dateReleve: meilleur.dateReleve,
  };
}

async function handle_publier_offre_vente(args, user) {
  if (!args.confirmation) {
    return {
      succes: false,
      message: "L'utilisateur n'a pas confirme. Demandez confirmation d'abord.",
    };
  }

  const recolte = await Recolte.findByPk(args.recolteId);
  if (!recolte) {
    return { succes: false, message: 'Recolte non trouvee.' };
  }
  if (recolte.utilisateurId !== user.id) {
    return {
      succes: false,
      message: "Cette recolte n'appartient pas a cet utilisateur.",
    };
  }

  const marche = await Marche.findByPk(args.marcheId);
  if (!marche) {
    return { succes: false, message: 'Marche non trouve.' };
  }

  const offre = await OffreVente.create({
    quantite: args.quantite,
    prixDemande: args.prixDemande,
    statut: 'ouverte',
    recolteId: args.recolteId,
    marcheId: args.marcheId,
  });

  if (recolte.statut === 'en_attente') {
    await recolte.update({ statut: 'disponible' });
  }

  return {
    succes: true,
    offre: {
      id: offre.id,
      quantite: offre.quantite,
      prixDemande: offre.prixDemande,
      marche: marche.nom,
    },
  };
}

async function handle_obtenir_mes_parcelles(args, user) {
  const parcelles = await Parcelle.findAll({
    where: { utilisateurId: user.id },
    order: [['createdAt', 'DESC']],
  });

  if (parcelles.length === 0) {
    return { trouve: false, message: 'Aucune parcelle trouvee.' };
  }

  return {
    trouve: true,
    total: parcelles.length,
    parcelles: parcelles.map((p) => ({
      id: p.id,
      nom: p.nom,
      superficie: p.superficie,
      commune: p.commune,
    })),
  };
}

async function handle_obtenir_prix_marche(args) {
  const where = {
    produit: { [Op.iLike]: `%${args.produit}%` },
  };
  if (args.marche) {
    where.marche = { [Op.iLike]: `%${args.marche}%` };
  }

  const prix = await PrixMarche.findAll({
    where,
    order: [['dateReleve', 'DESC']],
    limit: 10,
  });

  if (prix.length === 0) {
    return {
      trouve: false,
      message: `Aucun prix trouve pour "${args.produit}".`,
    };
  }

  return {
    trouve: true,
    total: prix.length,
    prix: prix.map((p) => ({
      produit: p.produit,
      marche: p.marche,
      prix: p.prix,
      unite: p.unite,
      dateReleve: p.dateReleve,
    })),
  };
}

// ──────────────────────────────────────────────────────────────
// Handler dispatcher
// ──────────────────────────────────────────────────────────────

const TOOL_HANDLERS = {
  obtenir_mes_recoltes: handle_obtenir_mes_recoltes,
  creer_recolte: handle_creer_recolte,
  obtenir_meilleur_prix: handle_obtenir_meilleur_prix,
  publier_offre_vente: handle_publier_offre_vente,
  obtenir_mes_parcelles: handle_obtenir_mes_parcelles,
  obtenir_prix_marche: handle_obtenir_prix_marche,
};

/**
 * Execute a tool call by name.
 * @param {string} toolName
 * @param {object} args
 * @param {object} user - { id, role }
 * @returns {Promise<object>}
 */
async function executeTool(toolName, args, user) {
  const handler = TOOL_HANDLERS[toolName];
  if (!handler) {
    return { erreur: `Outil inconnu: ${toolName}` };
  }

  try {
    return await handler(args, user);
  } catch (err) {
    console.error(`Erreur lors de l'execution de l'outil ${toolName}:`, err);
    return { erreur: `Erreur: ${err.message}` };
  }
}

module.exports = { TOOL_DEFINITIONS, executeTool };
