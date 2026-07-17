# FellahConnect — Equipe Projet

## Projet

| Champ | Valeur |
|---|---|
| **Nom** | FellahConnect |
| **Description** | Plateforme REST API pour aider les petits agriculteurs marocains a gerer leurs activites agricoles, suivre les prix du marche, et vendre leurs recoltes au meilleur prix grace a un assistant IA. |
| **Depot GitHub** | [Fellah_connect](https://github.com/fikrifatimezzahra20-blip/Fellah_connect) |
| **Jira Board** | [FEL Board 397](https://fikrifatimezzahra24.atlassian.net/jira/software/projects/FEL/boards/397) |

---

## Membres de l'Equipe

| Nom | Role | Responsabilites |
|---|---|---|
| **Fikri Fatimezzahra** | Chef de Projet / Developpeur Backend | Architecture, integration IA (DeepSeek), tests E2E, securite, Postman, gestion du board Jira |
| **Yakine 2** | Developpeur Backend | Routes & controllers, validation Zod, logging, middlewares |

---

## Stack Technique

| Composant | Technologie |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| ORM | Sequelize v6 |
| Base de Donnees | PostgreSQL 16 (Docker) |
| Authentification | JWT (jsonwebtoken + bcrypt) |
| Validation | Zod v4 |
| Logging | Winston |
| IA / Agent | DeepSeek API (compatible OpenAI function calling) |
| Tests | Jest + Supertest |
| Securite | Helmet + express-rate-limit |
| Conteneurisation | Docker Compose |

---

## Structure du Projet

```
Fellah_connect/
├── config/             # Configuration Sequelize & DB
├── controllers/        # Logique metier des endpoints
├── diagrams/           # Diagrammes UML
├── middlewares/         # Auth, roles, validation, erreurs, requestId
├── migrations/         # Migrations Sequelize
├── models/             # Modeles Sequelize (Utilisateur, Recolte, Parcelle, etc.)
├── postman/            # Collection & environnement Postman
├── prompts/            # System prompt de l'agent IA
├── routes/             # Definition des routes Express
├── services/           # Services metier (agent loop, DeepSeek, memoire)
├── src/                # Point d'entree alternatif (dev/start)
├── tests/              # Tests d'integration et E2E
├── utils/              # Utilitaires (logger Winston)
├── validators/         # Schemas de validation Zod
├── server.js           # Application Express principale
├── CONCEPTION.md       # Document de conception
├── EQUIPE.md           # Ce fichier
├── GIT_FLOW.md         # Conventions Git Flow
├── docker-compose.yml  # PostgreSQL local
└── package.json        # Dependances et scripts
```

---

## Conventions

- **Langue du code** : Anglais pour les noms de variables/fonctions, Francais pour les messages API et la documentation.
- **Git Flow** : Voir [GIT_FLOW.md](GIT_FLOW.md) pour les conventions de branches et commits.
- **Tests** : Chaque feature doit etre accompagnee de tests d'integration.
- **Code Review** : Chaque PR necessite au moins 1 approbation avant merge.
