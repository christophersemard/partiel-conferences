# 🎤 Gestionnaire de conférences — Projet Fullstack

Ce projet est une application fullstack permettant de :

* gérer des **conférences** (création, édition, planning par salle),
* permettre aux visiteurs de **s'inscrire à leur planning**,
* gérer un espace **admin**, un accès **sponsor** et une interface **visiteur**.

---

## ⚙️ Prérequis

* **Node.js** `v20.x` recommandé
* **pnpm** (si besoin, installez-le avec) :

```bash
npm install -g pnpm
```

---

## 🚀 Installation

1. **Cloner le projet**

```bash
git clone https://github.com/christophersemard/partiel-conferences.git
cd partiel-conferences
```

---

2. **Configurer l'environnement**

Le fichier .env a été envoyé sur le classroom, il est à placer dans le répertoire /backend

3. **Installer les dépendances**

Dans un terminal à la racine
```bash
pnpm install
```
---

## 🔄 Lancer les projets

### Backend

Dans un terminal à la racine
```bash
pnpm backend
```

### Frontend

Dans un terminal à la racine
```bash
pnpm frontend
```

---

## 👤 Comptes de test

| Rôle     | Email                                             | Mot de passe |
| -------- | ------------------------------------------------- | ------------ |
| Admin    | [admin@example.com](mailto:admin@example.com)     | password     |
| Sponsor  | [sponsor1@example.com](mailto:sponsor1@example.com) | password     |
| Visiteur 1 | [visitor1@example.com](mailto:visitor1@example.com)               | password     |
| Visiteur 2 | [visitor2@example.com](mailto:visitor2@example.com)               | password     |

---

## 📆 Données de test

Le seed de base contient :

* 3 salles (Alpha, Beta, Gamma)
* Plusieurs conférences sur 2 jours (25 et 26 septembre)
* Des intervenants uniques
* 2 sponsors
* Un planning déjà un peu pré-rempli pour les visiteurs

