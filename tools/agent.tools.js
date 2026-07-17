'use strict';

const { Recolte, Parcelle, PrixMarche, Offre, Marche, Produit, Agriculteur } = require('../models');
const { Op } = require('sequelize');

// ──────────────────────────────────────────────────────────────
// Tool definitions (OpenAI-compatible function calling schema)
// ──────────────────────────────────────────────────────────────

const TOOL_DEFINITIONS = [
  {
    type: 'function',
    function: {
      name: 'consulter_recoltes',
      description: "Consulter la liste des recoltes de l'utilisateur.",
      parameters: {
        type: 'object',
        properties: {
          user_id: {
            type: 'integer',
            description: "ID de l'utilisateur (optionnel, par defaut l'utilisateur connecte).",
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'consulter_parcelles',
      description: "Consulter la liste des parcelles de l'utilisateur.",
      parameters: {
        type: 'object',
        properties: {
          user_id: {
            type: 'integer',
            description: "ID de l'utilisateur (optionnel, par defaut l'utilisateur connecte).",
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'rechercher_prix_marches',
      description: 'Rechercher les prix des marches pour un produit.',
      parameters: {
        type: 'object',
        properties: {
          produit_id: {
            type: 'integer',
            description: "ID du produit a rechercher (optionnel si le nom du produit est specifie).",
          },
          produit: {
            type: 'string',
            description: "Nom du produit a rechercher (optionnel si l'ID est specifie).",
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'enregistrer_recolte',
      description: "Enregistre une nouvelle recolte. Demander la confirmation de l'utilisateur avant d'executer avec confirmation=true.",
      parameters: {
        type: 'object',
        properties: {
          parcelle_id: {
            type: 'integer',
            description: "ID de la parcelle.",
          },
          produit_id: {
            type: 'integer',
            description: "ID du produit.",
          },
          quantite: {
            type: 'number',
            description: "Quantite recoltee (en kg).",
          },
          date_recolte: {
            type: 'string',
            description: "Date de la recolte (format YYYY-MM-DD, optionnel, aujourd'hui par defaut).",
          },
          confirmation: {
            type: 'boolean',
            description: "true si l'utilisateur a explicitement confirme l'enregistrement de cette recolte.",
          },
        },
        required: ['parcelle_id', 'produit_id', 'quantite', 'confirmation'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'creer_offre_vente',
      description: "Publie une offre de vente pour une recolte. Demander la confirmation de l'utilisateur avant d'executer avec confirmation=true.",
      parameters: {
        type: 'object',
        properties: {
          recolte_id: {
            type: 'integer',
            description: "ID de la recolte.",
          },
          quantite: {
            type: 'number',
            description: "Quantite a vendre (en kg).",
          },
          prix_demande: {
            type: 'number',
            description: "Prix demande (en DH/kg).",
          },
          marche_id: {
            type: 'integer',
            description: "ID du marche (optionnel, sera determine automatiquement si non specifie).",
          },
          confirmation: {
            type: 'boolean',
            description: "true si l'utilisateur a explicitement confirme la creation de l'offre.",
          },
        },
        required: ['recolte_id', 'quantite', 'prix_demande', 'confirmation'],
      },
    },
  },
];

// ──────────────────────────────────────────────────────────────
// Tool handlers — each returns a JSON-serializable result
// ──────────────────────────────────────────────────────────────

async function handle_consulter_recoltes(args, user) {
  const targetUserId = args.user_id || user.id;

  if (user.role !== 'admin' && targetUserId !== user.id) {
    return {
      succes: false,
      message: "Vous n'etes pas autorise a consulter les recoltes d'un autre utilisateur.",
    };
  }

  let queryAgriculteurId = user.agriculteurId;
  if (user.role === 'admin' && args.user_id) {
    const ag = await Agriculteur.findOne({ where: { userId: args.user_id } });
    queryAgriculteurId = ag ? ag.id : args.user_id;
  }

  const recoltes = await Recolte.findAll({
    where: { agriculteurId: queryAgriculteurId },
    include: [
      { model: Produit, as: 'produitRef', attributes: ['nom', 'categorie', 'unite'] },
      { model: Parcelle, as: 'parcelle', attributes: ['nom', 'commune'] }
    ],
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
      produit: r.produitRef ? r.produitRef.nom : r.produit,
      quantiteKg: r.quantiteKg,
      statut: r.statut,
      dateRecolte: r.dateRecolte,
      prixSouhaite: r.prixSouhaite,
      parcelle: r.parcelle ? r.parcelle.nom : null,
    })),
  };
}

async function handle_consulter_parcelles(args, user) {
  const targetUserId = args.user_id || user.id;

  if (user.role !== 'admin' && targetUserId !== user.id) {
    return {
      succes: false,
      message: "Vous n'etes pas autorise a consulter les parcelles d'un autre utilisateur.",
    };
  }

  let queryAgriculteurId = user.agriculteurId;
  if (user.role === 'admin' && args.user_id) {
    const ag = await Agriculteur.findOne({ where: { userId: args.user_id } });
    queryAgriculteurId = ag ? ag.id : args.user_id;
  }

  const parcelles = await Parcelle.findAll({
    where: { agriculteurId: queryAgriculteurId },
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

async function handle_rechercher_prix_marches(args) {
  let productCondition = {};

  if (args.produit_id) {
    productCondition = { id: args.produit_id };
  } else if (args.produit) {
    productCondition = { nom: { [Op.iLike]: `%${args.produit}%` } };
  } else {
    return { trouve: false, message: "Vous devez specifier un nom ou un ID de produit." };
  }

  const product = await Produit.findOne({ where: productCondition });
  if (!product) {
    return { trouve: false, message: `Aucun produit trouve pour ${args.produit_id ? 'l\'ID ' + args.produit_id : '"' + args.produit + '"'}.` };
  }

  const prices = await PrixMarche.findAll({
    where: { produitId: product.id },
    include: [{ model: Marche, as: 'marcheRef', attributes: ['nom', 'ville'] }],
    order: [['dateReleve', 'DESC']],
    limit: 10,
  });

  if (prices.length === 0) {
    const legacyPrices = await PrixMarche.findAll({
      where: { produit: { [Op.iLike]: `%${product.nom}%` } },
      order: [['dateReleve', 'DESC']],
      limit: 10,
    });

    if (legacyPrices.length === 0) {
      return { trouve: false, message: `Aucun releve de prix trouve pour le produit "${product.nom}".` };
    }

    return {
      trouve: true,
      total: legacyPrices.length,
      produit: product.nom,
      prix: legacyPrices.map((p) => ({
        marche: p.marche,
        prix: p.prix,
        unite: p.unite,
        dateReleve: p.dateReleve,
      })),
    };
  }

  return {
    trouve: true,
    total: prices.length,
    produit: product.nom,
    prix: prices.map((p) => ({
      marche: p.marcheRef ? p.marcheRef.nom : p.marche,
      ville: p.marcheRef ? p.marcheRef.ville : null,
      prix: p.prix,
      unite: p.unite,
      dateReleve: p.dateReleve,
    })),
  };
}

async function handle_enregistrer_recolte(args, user) {
  if (!args.confirmation) {
    return {
      succes: false,
      confirmationRequise: true,
      message: "Confirmation requise pour enregistrer cette recolte.",
    };
  }

  const parcelle = await Parcelle.findByPk(args.parcelle_id);
  if (!parcelle) {
    return { succes: false, message: "Parcelle non trouvee." };
  }
  if (parcelle.agriculteurId !== user.agriculteurId) {
    return {
      succes: false,
      message: "Cette parcelle n'appartient pas a l'utilisateur connecte.",
    };
  }

  const produit = await Produit.findByPk(args.produit_id);
  if (!produit) {
    return { succes: false, message: "Produit non trouve." };
  }

  const dateRecolte = args.date_recolte ? new Date(args.date_recolte) : new Date();

  const recolte = await Recolte.create({
    quantiteKg: args.quantite,
    dateRecolte,
    statut: 'en_attente',
    parcelleId: args.parcelle_id,
    produitId: args.produit_id,
    agriculteurId: user.agriculteurId,
  });

  return {
    succes: true,
    recolte: {
      id: recolte.id,
      produit: produit.nom,
      quantiteKg: recolte.quantiteKg,
      statut: recolte.statut,
      dateRecolte: recolte.dateRecolte,
    },
  };
}

async function handle_creer_offre_vente(args, user) {
  if (!args.confirmation) {
    return {
      succes: false,
      confirmationRequise: true,
      message: "Confirmation requise pour creer cette offre de vente.",
    };
  }

  const recolte = await Recolte.findByPk(args.recolte_id, {
    include: [{ model: Produit, as: 'produitRef' }]
  });
  if (!recolte) {
    return { succes: false, message: "Recolte non trouvee." };
  }
  if (recolte.agriculteurId !== user.agriculteurId) {
    return {
      succes: false,
      message: "Cette recolte n'appartient pas a l'utilisateur connecte.",
    };
  }

  let finalMarcheId = args.marche_id;

  if (!finalMarcheId) {
    const bestPrice = await PrixMarche.findOne({
      where: { produitId: recolte.produitId || null },
      order: [['prix', 'DESC']],
    });

    if (bestPrice && bestPrice.marcheId) {
      finalMarcheId = bestPrice.marcheId;
    } else {
      const anyMarche = await Marche.findOne();
      if (!anyMarche) {
        return { succes: false, message: "Aucun marche disponible dans le systeme pour publier l'offre." };
      }
      finalMarcheId = anyMarche.id;
    }
  }

  const marche = await Marche.findByPk(finalMarcheId);
  if (!marche) {
    return { succes: false, message: "Marche non trouve." };
  }

  const offre = await Offre.create({
    quantite: args.quantite,
    prixDemande: args.prix_demande,
    statut: 'ouverte',
    recolteId: args.recolte_id,
    marcheId: finalMarcheId,
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
      produit: recolte.produitRef ? recolte.produitRef.nom : recolte.produit,
    },
  };
}

// ──────────────────────────────────────────────────────────────
// Handler dispatcher
// ──────────────────────────────────────────────────────────────

const TOOL_HANDLERS = {
  consulter_recoltes: handle_consulter_recoltes,
  consulter_parcelles: handle_consulter_parcelles,
  rechercher_prix_marches: handle_rechercher_prix_marches,
  enregistrer_recolte: handle_enregistrer_recolte,
  creer_offre_vente: handle_creer_offre_vente,
};

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
