# FellahConnect — Git Flow & Project Management Conventions

## Branch Strategy

We follow a simplified **Git Flow** workflow adapted for a small team.

### Branch Types

| Branch | Purpose | Naming Convention | Created From |
|---|---|---|---|
| `main` | Production-ready code. Protected. | `main` | — |
| `develop` | Integration branch for features. | `develop` | `main` |
| `feature/*` | New features or enhancements. | `feature/FEL-XX-short-description` | `develop` |
| `bugfix/*` | Bug fixes (non-urgent). | `bugfix/FEL-XX-short-description` | `develop` |
| `hotfix/*` | Urgent production fixes. | `hotfix/FEL-XX-short-description` | `main` |

### Examples

```
feature/FEL-14-zod-validation
bugfix/FEL-20-logging-format
hotfix/FEL-99-auth-crash
```

---

## Commit Message Format

We use **conventional commits** with the Jira issue key:

```
<type>(FEL-XX): <short description>

[optional body]
```

### Types

| Type | Usage |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Tooling, config, dependency updates |

### Examples

```
feat(FEL-14): add Zod validation schemas for all routes
fix(FEL-20): handle Zod errors in centralized error middleware
docs(FEL-4): create Git Flow documentation
test(FEL-21): add integration tests for auth endpoints
```

---

## Pull Request (PR) Process

1. **Create a branch** from `develop` following the naming convention above.
2. **Commit frequently** with conventional commit messages.
3. **Push your branch** and open a PR targeting `develop`.
4. **PR Title**: Same format as commit messages — `feat(FEL-XX): description`.
5. **PR Description**: Include:
   - What was changed and why
   - Link to the Jira issue
   - Testing done (manual + automated)
6. **Code Review**: At least **1 team member** must approve before merging.
7. **Merge Strategy**: Use **Squash and Merge** to keep `develop` history clean.
8. **Delete the branch** after merging.

---

## Protected Branches

| Branch | Rules |
|---|---|
| `main` | No direct pushes. PRs only. Requires 1 approval. |
| `develop` | No direct pushes. PRs only. Requires 1 approval. |

---

## Jira Board Workflow

| Column | Description |
|---|---|
| **To Do** | Task is defined and ready to be picked up. |
| **In Progress** | Developer is actively working on the task. |
| **Code Review** | PR is open and awaiting review. |
| **Done** | PR is merged and task is verified. |

### Rules
- Move your Jira ticket to **In Progress** when you start working.
- Move to **Code Review** when you open a PR.
- Move to **Done** only after the PR is merged.
- Each PR should correspond to **one Jira ticket**.

---

## Release Process

1. When `develop` is stable and all sprint tasks are **Done**, create a PR from `develop` → `main`.
2. Tag the merge commit with a version: `v1.0.0`, `v1.1.0`, etc.
3. Deploy from `main`.
