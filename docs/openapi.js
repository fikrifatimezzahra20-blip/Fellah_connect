'use strict';

/**
 * OpenAPI 3.1.0 specification for FellahConnect API.
 * Auto-generated from models, validators and controllers.
 */
const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'FellahConnect API',
    version: '1.0.0',
    description:
      'Plateforme REST pour les agriculteurs marocains — gestion des parcelles, récoltes, prix du marché et recommandations de vente IA.',
    contact: { name: 'Equipe FellahConnect' },
    license: { name: 'ISC' },
  },
  servers: [
    {
      url: 'http://localhost:{port}/api',
      description: 'Serveur de développement local',
      variables: { port: { default: '3000' } },
    },
  ],

  // ── Tags ──────────────────────────────────────────────────────
  tags: [
    { name: 'Auth', description: 'Inscription, connexion et profil utilisateur' },
    { name: 'Agent IA', description: 'Chatbot IA et gestion de la mémoire' },
    { name: 'Parcelles', description: 'CRUD des parcelles agricoles' },
    { name: 'Récoltes', description: 'CRUD des récoltes' },
    { name: 'Produits', description: 'Catalogue des produits (admin)' },
    { name: 'Marchés', description: 'Catalogue des marchés (admin)' },
    { name: 'Prix Marchés', description: 'Prix relevés sur les marchés' },
    { name: 'Offres', description: 'Offres de vente liées aux récoltes' },
    { name: 'Agriculteurs', description: 'Consultation des agriculteurs et leurs parcelles' },
    { name: 'Santé', description: 'Vérification de santé du service' },
  ],

  // ── Security ──────────────────────────────────────────────────
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenu via POST /auth/login ou /auth/register',
      },
    },

    // ── Reusable Schemas ────────────────────────────────────────
    schemas: {
      // ── Error ─────────────────────────────────────────────────
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string', examples: ['Identifiants incorrects.'] },
          details: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
          },
          requestId: { type: 'string', nullable: true },
        },
        required: ['message'],
      },

      // ── User (safe) ──────────────────────────────────────────
      UserSafe: {
        type: 'object',
        properties: {
          id: { type: 'integer', examples: [1] },
          nom: { type: 'string', nullable: true, examples: ['Ahmed'] },
          telephone: { type: 'string', nullable: true, examples: ['0612345678'] },
          email: { type: 'string', format: 'email', nullable: true, examples: ['ahmed@example.com'] },
          role: { type: 'string', enum: ['agriculteur', 'admin'], examples: ['agriculteur'] },
          region: { type: 'string', nullable: true, examples: ['Souss-Massa'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },

      // ── Agriculteur ───────────────────────────────────────────
      Agriculteur: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nom: { type: 'string', examples: ['Ahmed'] },
          telephone: { type: 'string', examples: ['0612345678'] },
          region: { type: 'string', nullable: true, examples: ['Souss-Massa'] },
          userId: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },

      // ── Parcelle ──────────────────────────────────────────────
      Parcelle: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nom: { type: 'string', examples: ['Parcelle Nord'] },
          superficie: { type: 'number', format: 'float', examples: [2.5] },
          commune: { type: 'string', examples: ['Ouled Teima'] },
          agriculteurId: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateParcelle: {
        type: 'object',
        required: ['nom', 'superficie', 'commune'],
        properties: {
          nom: { type: 'string', minLength: 1 },
          superficie: { type: 'number', exclusiveMinimum: 0 },
          commune: { type: 'string', minLength: 1 },
        },
      },
      UpdateParcelle: {
        type: 'object',
        properties: {
          nom: { type: 'string', minLength: 1 },
          superficie: { type: 'number', exclusiveMinimum: 0 },
          commune: { type: 'string', minLength: 1 },
        },
      },

      // ── Recolte ───────────────────────────────────────────────
      Recolte: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          quantiteKg: { type: 'number', format: 'float', examples: [150.0] },
          dateRecolte: { type: 'string', format: 'date-time' },
          statut: { type: 'string', enum: ['en_attente', 'disponible', 'vendue'] },
          parcelleId: { type: 'integer', nullable: true },
          produitId: { type: 'integer', nullable: true },
          produit: { type: 'string', examples: ['Tomate'] },
          prixSouhaite: { type: 'number', format: 'float', nullable: true },
          agriculteurId: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          parcelle: { $ref: '#/components/schemas/Parcelle', nullable: true },
          produitRef: { $ref: '#/components/schemas/Produit', nullable: true },
        },
      },
      CreateRecolte: {
        type: 'object',
        required: ['quantiteKg'],
        properties: {
          quantiteKg: { type: 'number', exclusiveMinimum: 0 },
          dateRecolte: { type: 'string', format: 'date-time' },
          statut: { type: 'string', enum: ['en_attente', 'disponible', 'vendue'] },
          parcelleId: { type: 'integer', nullable: true },
          produitId: { type: 'integer', nullable: true },
          produit: { type: 'string', nullable: true },
          prixSouhaite: { type: 'number', exclusiveMinimum: 0, nullable: true },
        },
      },
      UpdateRecolte: {
        type: 'object',
        properties: {
          quantiteKg: { type: 'number', exclusiveMinimum: 0 },
          dateRecolte: { type: 'string', format: 'date-time' },
          statut: { type: 'string', enum: ['en_attente', 'disponible', 'vendue'] },
          parcelleId: { type: 'integer', nullable: true },
          produitId: { type: 'integer', nullable: true },
          prixSouhaite: { type: 'number', exclusiveMinimum: 0, nullable: true },
        },
      },

      // ── Produit ───────────────────────────────────────────────
      Produit: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nom: { type: 'string', examples: ['Tomate'] },
          categorie: { type: 'string', examples: ['Légumes'] },
          unite: { type: 'string', examples: ['kg'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateProduit: {
        type: 'object',
        required: ['nom', 'categorie'],
        properties: {
          nom: { type: 'string', minLength: 1 },
          categorie: { type: 'string', minLength: 1 },
          unite: { type: 'string' },
        },
      },
      UpdateProduit: {
        type: 'object',
        properties: {
          nom: { type: 'string', minLength: 1 },
          categorie: { type: 'string', minLength: 1 },
          unite: { type: 'string' },
        },
      },

      // ── Marche ────────────────────────────────────────────────
      Marche: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nom: { type: 'string', examples: ['Souk El Had'] },
          ville: { type: 'string', examples: ['Agadir'] },
          region: { type: 'string', examples: ['Souss-Massa'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateMarche: {
        type: 'object',
        required: ['nom', 'ville', 'region'],
        properties: {
          nom: { type: 'string', minLength: 1 },
          ville: { type: 'string', minLength: 1 },
          region: { type: 'string', minLength: 1 },
        },
      },
      UpdateMarche: {
        type: 'object',
        properties: {
          nom: { type: 'string', minLength: 1 },
          ville: { type: 'string', minLength: 1 },
          region: { type: 'string', minLength: 1 },
        },
      },

      // ── PrixMarche ────────────────────────────────────────────
      PrixMarche: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          produit: { type: 'string', examples: ['Tomate'] },
          marche: { type: 'string', examples: ['Souk El Had'] },
          prix: { type: 'number', format: 'float', examples: [8.5] },
          unite: { type: 'string', examples: ['DH/kg'] },
          dateReleve: { type: 'string', format: 'date-time' },
          produitId: { type: 'integer', nullable: true },
          marcheId: { type: 'integer', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          produitRef: { $ref: '#/components/schemas/Produit', nullable: true },
          marcheRef: { $ref: '#/components/schemas/Marche', nullable: true },
        },
      },
      CreatePrixMarche: {
        type: 'object',
        required: ['prix', 'dateReleve'],
        properties: {
          prix: { type: 'number', exclusiveMinimum: 0 },
          dateReleve: { type: 'string', minLength: 1, examples: ['2026-07-15'] },
          produit: { type: 'string', description: 'Requis si produitId absent' },
          marche: { type: 'string', description: 'Requis si marcheId absent' },
          unite: { type: 'string' },
          produitId: { type: 'integer', nullable: true },
          marcheId: { type: 'integer', nullable: true },
        },
      },
      UpdatePrixMarche: {
        type: 'object',
        properties: {
          produit: { type: 'string' },
          marche: { type: 'string' },
          prix: { type: 'number', exclusiveMinimum: 0 },
          unite: { type: 'string' },
          dateReleve: { type: 'string' },
        },
      },

      // ── Offre ─────────────────────────────────────────────────
      Offre: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          quantite: { type: 'number', format: 'float', examples: [50.0] },
          prixDemande: { type: 'number', format: 'float', examples: [12.0] },
          statut: { type: 'string', enum: ['ouverte', 'acceptee', 'fermee'] },
          recolteId: { type: 'integer' },
          marcheId: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          recolte: { $ref: '#/components/schemas/Recolte', nullable: true },
          marche: { $ref: '#/components/schemas/Marche', nullable: true },
        },
      },
      CreateOffre: {
        type: 'object',
        required: ['quantite', 'prixDemande', 'recolteId', 'marcheId'],
        properties: {
          quantite: { type: 'number', exclusiveMinimum: 0 },
          prixDemande: { type: 'number', exclusiveMinimum: 0 },
          recolteId: { type: 'integer', minimum: 1 },
          marcheId: { type: 'integer', minimum: 1 },
        },
      },
      UpdateOffre: {
        type: 'object',
        properties: {
          quantite: { type: 'number', exclusiveMinimum: 0 },
          prixDemande: { type: 'number', exclusiveMinimum: 0 },
          statut: { type: 'string', enum: ['ouverte', 'acceptee', 'fermee'] },
        },
      },

      // ── Register / Login ──────────────────────────────────────
      RegisterBody: {
        type: 'object',
        required: ['nom', 'telephone', 'motDePasse'],
        properties: {
          nom: { type: 'string', minLength: 1, examples: ['Ahmed'] },
          telephone: { type: 'string', minLength: 1, examples: ['0612345678'] },
          email: { type: 'string', format: 'email', nullable: true },
          motDePasse: { type: 'string', minLength: 6, examples: ['secret123'] },
          region: { type: 'string', nullable: true },
        },
      },
      LoginBody: {
        type: 'object',
        required: ['telephone', 'motDePasse'],
        properties: {
          telephone: { type: 'string', minLength: 1, examples: ['0612345678'] },
          motDePasse: { type: 'string', minLength: 1, examples: ['secret123'] },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/UserSafe' },
          token: { type: 'string', examples: ['eyJhbGciOiJIUzI1NiIs...'] },
        },
      },

      // ── Agent ─────────────────────────────────────────────────
      ChatBody: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', minLength: 1, examples: ['Quel est le meilleur prix pour les tomates ?'] },
        },
      },
      ChatResponse: {
        type: 'object',
        properties: {
          reply: { type: 'string' },
          toolsUsed: {
            type: 'array',
            items: { type: 'string' },
          },
          maxIterationsReached: { type: 'boolean' },
        },
      },
    },

    // ── Reusable Parameters ─────────────────────────────────────
    parameters: {
      IdPath: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer', minimum: 1 },
        description: 'Identifiant numérique de la ressource',
      },
    },

    // ── Reusable Responses ──────────────────────────────────────
    responses: {
      Unauthorized: {
        description: 'Token manquant ou invalide',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { message: 'Token manquant.' },
          },
        },
      },
      Forbidden: {
        description: 'Accès refusé (rôle insuffisant)',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { message: 'Acces refuse.' },
          },
        },
      },
      NotFound: {
        description: 'Ressource non trouvée',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { message: 'Ressource non trouvee.' },
          },
        },
      },
      ValidationError: {
        description: 'Données invalides',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { message: 'Donnees invalides.', details: ['nom: est requis.'] },
          },
        },
      },
    },
  },

  // ── Paths ─────────────────────────────────────────────────────
  paths: {
    // ════════════════════════════════════════════════════════════
    //  HEALTH
    // ════════════════════════════════════════════════════════════
    '/health': {
      get: {
        tags: ['Santé'],
        summary: 'Vérification de santé',
        operationId: 'healthCheck',
        responses: {
          200: {
            description: 'Service opérationnel',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', examples: ['ok'] },
                    service: { type: 'string', examples: ['fellahconnect-api'] },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ════════════════════════════════════════════════════════════
    //  AUTH
    // ════════════════════════════════════════════════════════════
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Inscription d\'un nouvel agriculteur',
        operationId: 'register',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterBody' } } },
        },
        responses: {
          201: {
            description: 'Utilisateur créé avec succès',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          400: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Connexion par téléphone et mot de passe',
        operationId: 'login',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } } },
        },
        responses: {
          200: {
            description: 'Connexion réussie',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Profil de l\'utilisateur connecté',
        operationId: 'getMe',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Profil utilisateur',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { user: { $ref: '#/components/schemas/UserSafe' } },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════
    //  AGENT IA
    // ════════════════════════════════════════════════════════════
    '/agent/chat': {
      post: {
        tags: ['Agent IA'],
        summary: 'Envoyer un message au chatbot IA',
        operationId: 'agentChat',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ChatBody' } } },
        },
        responses: {
          200: {
            description: 'Réponse de l\'agent',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ChatResponse' } } },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/agent/memory': {
      delete: {
        tags: ['Agent IA'],
        summary: 'Réinitialiser la mémoire de conversation',
        operationId: 'agentResetMemory',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Mémoire réinitialisée',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                },
                example: { message: 'Memoire reinitialisee.' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════
    //  PARCELLES
    // ════════════════════════════════════════════════════════════
    '/parcelles': {
      get: {
        tags: ['Parcelles'],
        summary: 'Lister les parcelles de l\'agriculteur connecté',
        operationId: 'listParcelles',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Liste des parcelles',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    parcelles: { type: 'array', items: { $ref: '#/components/schemas/Parcelle' } },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Parcelles'],
        summary: 'Créer une parcelle',
        operationId: 'createParcelle',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateParcelle' } } },
        },
        responses: {
          201: {
            description: 'Parcelle créée',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { parcelle: { $ref: '#/components/schemas/Parcelle' } },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/parcelles/{id}': {
      get: {
        tags: ['Parcelles'],
        summary: 'Détail d\'une parcelle',
        operationId: 'getParcelle',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        responses: {
          200: {
            description: 'Parcelle trouvée',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { parcelle: { $ref: '#/components/schemas/Parcelle' } },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Parcelles'],
        summary: 'Mettre à jour une parcelle',
        operationId: 'updateParcelle',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateParcelle' } } },
        },
        responses: {
          200: {
            description: 'Parcelle mise à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { parcelle: { $ref: '#/components/schemas/Parcelle' } },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Parcelles'],
        summary: 'Supprimer une parcelle',
        operationId: 'deleteParcelle',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        responses: {
          200: {
            description: 'Parcelle supprimée',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                },
                example: { message: 'Parcelle supprimee.' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════
    //  RECOLTES
    // ════════════════════════════════════════════════════════════
    '/recoltes': {
      get: {
        tags: ['Récoltes'],
        summary: 'Lister les récoltes de l\'agriculteur connecté',
        operationId: 'listRecoltes',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'statut',
            in: 'query',
            schema: { type: 'string', enum: ['en_attente', 'disponible', 'vendue'] },
            description: 'Filtrer par statut',
          },
        ],
        responses: {
          200: {
            description: 'Liste des récoltes',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    recoltes: { type: 'array', items: { $ref: '#/components/schemas/Recolte' } },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Récoltes'],
        summary: 'Créer une récolte',
        operationId: 'createRecolte',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateRecolte' } } },
        },
        responses: {
          201: {
            description: 'Récolte créée',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { recolte: { $ref: '#/components/schemas/Recolte' } },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/recoltes/{id}': {
      get: {
        tags: ['Récoltes'],
        summary: 'Détail d\'une récolte',
        operationId: 'getRecolte',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        responses: {
          200: {
            description: 'Récolte trouvée',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { recolte: { $ref: '#/components/schemas/Recolte' } },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Récoltes'],
        summary: 'Mettre à jour une récolte',
        operationId: 'updateRecolte',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateRecolte' } } },
        },
        responses: {
          200: {
            description: 'Récolte mise à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { recolte: { $ref: '#/components/schemas/Recolte' } },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Récoltes'],
        summary: 'Supprimer une récolte',
        operationId: 'deleteRecolte',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        responses: {
          200: {
            description: 'Récolte supprimée',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                },
                example: { message: 'Recolte supprimee.' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════
    //  PRODUITS
    // ════════════════════════════════════════════════════════════
    '/produits': {
      get: {
        tags: ['Produits'],
        summary: 'Lister les produits',
        operationId: 'listProduits',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'categorie',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filtrer par catégorie',
          },
        ],
        responses: {
          200: {
            description: 'Liste des produits',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    produits: { type: 'array', items: { $ref: '#/components/schemas/Produit' } },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Produits'],
        summary: 'Créer un produit (admin)',
        operationId: 'createProduit',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProduit' } } },
        },
        responses: {
          201: {
            description: 'Produit créé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { produit: { $ref: '#/components/schemas/Produit' } },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/produits/{id}': {
      get: {
        tags: ['Produits'],
        summary: 'Détail d\'un produit',
        operationId: 'getProduit',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        responses: {
          200: {
            description: 'Produit trouvé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { produit: { $ref: '#/components/schemas/Produit' } },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Produits'],
        summary: 'Mettre à jour un produit (admin)',
        operationId: 'updateProduit',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProduit' } } },
        },
        responses: {
          200: {
            description: 'Produit mis à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { produit: { $ref: '#/components/schemas/Produit' } },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Produits'],
        summary: 'Supprimer un produit (admin)',
        operationId: 'deleteProduit',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        responses: {
          200: {
            description: 'Produit supprimé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                },
                example: { message: 'Produit supprime.' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════
    //  MARCHES
    // ════════════════════════════════════════════════════════════
    '/marches': {
      get: {
        tags: ['Marchés'],
        summary: 'Lister les marchés',
        operationId: 'listMarches',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'region',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filtrer par région',
          },
        ],
        responses: {
          200: {
            description: 'Liste des marchés',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    marches: { type: 'array', items: { $ref: '#/components/schemas/Marche' } },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Marchés'],
        summary: 'Créer un marché (admin)',
        operationId: 'createMarche',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateMarche' } } },
        },
        responses: {
          201: {
            description: 'Marché créé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { marche: { $ref: '#/components/schemas/Marche' } },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/marches/{id}': {
      get: {
        tags: ['Marchés'],
        summary: 'Détail d\'un marché',
        operationId: 'getMarche',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        responses: {
          200: {
            description: 'Marché trouvé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { marche: { $ref: '#/components/schemas/Marche' } },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Marchés'],
        summary: 'Mettre à jour un marché (admin)',
        operationId: 'updateMarche',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateMarche' } } },
        },
        responses: {
          200: {
            description: 'Marché mis à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { marche: { $ref: '#/components/schemas/Marche' } },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Marchés'],
        summary: 'Supprimer un marché (admin)',
        operationId: 'deleteMarche',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        responses: {
          200: {
            description: 'Marché supprimé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                },
                example: { message: 'Marche supprime.' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════
    //  PRIX MARCHES
    // ════════════════════════════════════════════════════════════
    '/prix-marches': {
      get: {
        tags: ['Prix Marchés'],
        summary: 'Lister les prix du marché',
        operationId: 'listPrixMarches',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'produit', in: 'query', schema: { type: 'string' }, description: 'Recherche par nom de produit (insensible à la casse)' },
          { name: 'marche', in: 'query', schema: { type: 'string' }, description: 'Recherche par nom de marché (insensible à la casse)' },
          { name: 'dateReleve', in: 'query', schema: { type: 'string' }, description: 'Filtrer par date de relevé' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 100 }, description: 'Nombre max de résultats' },
        ],
        responses: {
          200: {
            description: 'Liste des prix',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    prixMarches: { type: 'array', items: { $ref: '#/components/schemas/PrixMarche' } },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Prix Marchés'],
        summary: 'Ajouter un prix marché (admin)',
        operationId: 'createPrixMarche',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePrixMarche' } } },
        },
        responses: {
          201: {
            description: 'Prix créé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { prixMarche: { $ref: '#/components/schemas/PrixMarche' } },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/prix-marches/meilleur/{nomProduit}': {
      get: {
        tags: ['Prix Marchés'],
        summary: 'Meilleur prix pour un produit donné',
        operationId: 'getMeilleurPrix',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'nomProduit',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Nom du produit (recherche partielle insensible à la casse)',
            examples: { tomate: { value: 'Tomate' } },
          },
        ],
        responses: {
          200: {
            description: 'Meilleur prix trouvé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    trouve: { type: 'boolean', examples: [true] },
                    meilleurPrix: { $ref: '#/components/schemas/PrixMarche' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Aucun prix trouvé pour ce produit',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    trouve: { type: 'boolean', examples: [false] },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/prix-marches/{id}': {
      get: {
        tags: ['Prix Marchés'],
        summary: 'Détail d\'un prix marché',
        operationId: 'getPrixMarche',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        responses: {
          200: {
            description: 'Prix trouvé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { prixMarche: { $ref: '#/components/schemas/PrixMarche' } },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Prix Marchés'],
        summary: 'Mettre à jour un prix marché (admin)',
        operationId: 'updatePrixMarche',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdatePrixMarche' } } },
        },
        responses: {
          200: {
            description: 'Prix mis à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { prixMarche: { $ref: '#/components/schemas/PrixMarche' } },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Prix Marchés'],
        summary: 'Supprimer un prix marché (admin)',
        operationId: 'deletePrixMarche',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        responses: {
          200: {
            description: 'Prix supprimé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                },
                example: { message: 'Prix supprime.' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════
    //  OFFRES
    // ════════════════════════════════════════════════════════════
    '/offres': {
      get: {
        tags: ['Offres'],
        summary: 'Lister les offres de l\'agriculteur connecté',
        operationId: 'listOffres',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'statut',
            in: 'query',
            schema: { type: 'string', enum: ['ouverte', 'acceptee', 'fermee'] },
            description: 'Filtrer par statut',
          },
        ],
        responses: {
          200: {
            description: 'Liste des offres',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    offres: { type: 'array', items: { $ref: '#/components/schemas/Offre' } },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Offres'],
        summary: 'Créer une offre de vente',
        operationId: 'createOffre',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateOffre' } } },
        },
        responses: {
          201: {
            description: 'Offre créée',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { offre: { $ref: '#/components/schemas/Offre' } },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/offres/{id}': {
      get: {
        tags: ['Offres'],
        summary: 'Détail d\'une offre',
        operationId: 'getOffre',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        responses: {
          200: {
            description: 'Offre trouvée',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { offre: { $ref: '#/components/schemas/Offre' } },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Offres'],
        summary: 'Mettre à jour une offre',
        operationId: 'updateOffre',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateOffre' } } },
        },
        responses: {
          200: {
            description: 'Offre mise à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { offre: { $ref: '#/components/schemas/Offre' } },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Offres'],
        summary: 'Supprimer une offre',
        operationId: 'deleteOffre',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        responses: {
          200: {
            description: 'Offre supprimée',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                },
                example: { message: 'Offre supprimee.' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════
    //  AGRICULTEURS
    // ════════════════════════════════════════════════════════════
    '/agriculteurs/{id}/parcelles': {
      get: {
        tags: ['Agriculteurs'],
        summary: 'Parcelles d\'un agriculteur',
        operationId: 'getFarmerParcelles',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdPath' }],
        responses: {
          200: {
            description: 'Agriculteur et ses parcelles',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    nom: { type: 'string' },
                    telephone: { type: 'string' },
                    email: { type: 'string', nullable: true },
                    region: { type: 'string', nullable: true },
                    parcelles: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          nom: { type: 'string' },
                          superficie: { type: 'number' },
                          commune: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
  },
};

module.exports = openApiSpec;
