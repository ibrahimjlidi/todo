# Backend Masterclass: Développement d'une API MERN Complète

## Objectifs de la Session

Cette session est dédiée à la maîtrise du backend MERN. À la fin, vous serez capable de :

- Mettre en place une architecture backend robuste suivant le pattern MVC (Modèle-Vue Contrôleur)
- Implémenter toutes les opérations CRUD (Create, Read, Update, Delete) pour une ressource
- Gérer l'authentification des utilisateurs (inscription et connexion) avec des mots de passe sécurisés et des tokens JWT
- Utiliser des middlewares pour la validation, l'authentification et la gestion des erreurs
- Comprendre chaque ligne de code et le rôle de chaque composant du backend
- Organiser la configuration de la base de données de manière centralisée et maintenable

## Prérequis

- Connaissances de base en JavaScript (ES+)
- Node.js et npm (ou yarn) installés
- MongoDB installé et fonctionnel (ou un compte MongoDB Atlas)
- Un éditeur de code (VS Code recommandé)
- Postman ou Insomnia pour tester les API

## Introduction à l'Architecture Backend (MVC)

Nous allons construire une API pour une application de gestion de tâches (Todo App) avec des fonctionnalités d'authentification. L'architecture suivra le pattern MVC pour une meilleure organisation et maintenabilité du code :

- **Models** : Définissent la structure des données et interagissent directement avec la base de données MongoDB via Mongoose
- **Controllers** : Contiennent la logique métier. Ils reçoivent les requêtes, interagissent avec les modèles, et renvoient les réponses
- **Routes** : Définissent les points d'accès (endpoints) de l'API et associent chaque route à une fonction de contrôleur
- **Middlewares** : Fonctions exécutées avant ou après les contrôleurs pour des tâches comme l'authentification, la validation ou la gestion des erreurs
- **Config** : Gère les configurations centralisées comme la connexion à la base de données

## Initialisation du Projet Backend

### Création du Dossier Projet et Initialisation

Ouvrez votre terminal et exécutez les commandes suivantes :

```bash
mkdir mern-auth-todo-backend
cd mern-auth-todo-backend
npm init -y
```

- `mkdir mern-auth-todo-backend` : Crée un nouveau dossier pour notre projet backend
- `cd mern-auth-todo-backend` : Navigue dans ce dossier
- `npm init -y` : Initialise un nouveau projet Node.js et crée un fichier package.json avec les valeurs par défaut. Le `-y` permet de sauter les questions interactives

### Installation des Dépendances

Nous aurons besoin de plusieurs packages. Installez-les avec npm :

```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install -D nodemon
```

- **express** : Framework web minimaliste et flexible pour Node.js, facilitant la création d'API RESTful
- **mongoose** : Bibliothèque de modélisation d'objets (ODM) pour MongoDB et Node.js, simplifiant les interactions avec la base de données
- **cors** : Middleware Express pour activer le Cross-Origin Resource Sharing (CORS), permettant aux requêtes provenant d'un domaine différent (votre frontend) d'accéder à votre API
- **dotenv** : Charge les variables d'environnement d'un fichier .env dans `process.env`, utile pour les configurations sensibles (clés API, URI de base de données)
- **bcryptjs** : Bibliothèque pour hacher les mots de passe de manière sécurisée. Essentiel pour l'authentification
- **jsonwebtoken** : Implémentation de JSON Web Tokens (JWT) pour créer et vérifier les tokens d'authentification
- **nodemon** : Outil de développement qui redémarre automatiquement le serveur lors des modifications de fichiers

## Structure du Projet (MVC Complète)

Voici l'arborescence que nous allons suivre pour organiser notre backend :

```
mern-auth-todo-backend/
├── node_modules/
├── config/
│   └── db.js
├── .env
├── package.json
├── server.js
├── models/
│   ├── Todo.js
│   └── User.js
├── controllers/
│   ├── todoController.js
│   └── authController.js
├── routes/
│   ├── todo.js
│   └── auth.js
└── middleware/
    └── authMiddleware.js
```

## Configuration de la Base de Données et Variables d'Environnement

### Fichier .env

Créez un fichier nommé `.env` à la racine de votre projet et ajoutez-y les lignes suivantes. Remplacez `YOUR_MONGO_URI` par l'URI de votre base de données MongoDB (locale ou Atlas) et `YOUR_JWT_SECRET` par une chaîne de caractères complexe et unique.

```
MONGO_URI=mongodb://localhost:27017/mernauthtodo
PORT=5000
JWT_SECRET=supersecretjwtkeythatnobodyknows
```

- **MONGO_URI** : L'URL de connexion à votre base de données MongoDB. Pour une instance locale, c'est généralement `mongodb://localhost:27017/nom_de_votre_db`. Pour MongoDB Atlas, utilisez le format `mongodb+srv://username:password@cluster.mongodb.net/dbname`
- **PORT** : Le port sur lequel votre serveur Express écoutera les requêtes
- **JWT_SECRET** : Une clé secrète utilisée pour signer et vérifier les JSON Web Tokens. Gardez cette clé confidentielle!

### Configuration Centralisée de la Base de Données (config/db.js)

La connexion à MongoDB est gérée dans un fichier de configuration séparé, suivant le pattern de séparation des préoccupations (concerns). Créez le fichier `config/db.js` :

```javascript
// Ligne 1: Importe le module Mongoose pour interagir avec MongoDB
const mongoose = require("mongoose");

/**
 * Fonction connectDB - Établit la connexion à la base de données MongoDB
 * 
 * Cette fonction est asynchrone car la connexion à la base de données peut prendre du temps.
 * Elle utilise try-catch pour gérer les erreurs de connexion de manière appropriée.
 * 
 * @async
 * @throws {Error} Si la connexion à MongoDB échoue
 */
const connectDB = async () => {
  try {
    // Ligne 2: Établit la connexion à MongoDB en utilisant l'URI de la variable d'environnement
    // async/await est utilisé pour attendre la résolution de la promesse
    await mongoose.connect(process.env.MONGO_URI);
    
    // Ligne 3: Affiche un message de succès dans la console
    console.log("MongoDB connected successfully");
  } catch (err) {
    // Ligne 4: Affiche les détails de l'erreur de connexion
    // Cette information est cruciale pour le debugging
    console.error("MongoDB connection error:", err.message);
    
    // Ligne 5: Arrête le processus Node.js en cas d'erreur critique
    // Code 1 indique une sortie avec erreur
    // Le serveur ne doit pas continuer si la base de données n'est pas accessible
    process.exit(1);
  }
};

// Ligne 6: Exporte la fonction connectDB pour être utilisée dans server.js
// Cette approche permet une séparation claire des préoccupations (concerns)
// et facilite les tests unitaires et la maintenance du code
module.exports = connectDB;
```

**Avantages de cette approche :**
- **Séparation des préoccupations** : La logique de connexion est isolée du point d'entrée
- **Réutilisabilité** : La fonction peut être utilisée dans différents contextes
- **Maintenabilité** : Tout ce qui concerne la base de données est centralisé
- **Testabilité** : Facilite les tests unitaires et l'injection de dépendances

## Point d'Entrée de l'Application Backend (server.js)

Créez le fichier `server.js` à la racine de votre projet. C'est le point d'entrée de votre application :

```javascript
// Ligne 1: Charge les variables d'environnement du fichier .env dans process.env
require("dotenv").config();

// Ligne 2: Importe le module Express pour créer et gérer le serveur web
const express = require("express");

// Ligne 3: Importe la fonction de connexion à MongoDB depuis config/db.js
const connectDB = require("./config/db");

// Ligne 4: Importe le middleware CORS pour gérer les requêtes cross-origin
const cors = require("cors");

// Ligne 5: Crée une instance de l'application Express
const app = express();

// Ligne 6: Définit le port du serveur, en utilisant la variable d'environnement
const PORT = process.env.PORT || 5000;

// Ligne 7: Connexion à MongoDB via la fonction centralisée
connectDB();

// Ligne 8: Middlewares globaux
app.use(cors()); // Ligne 9: Active CORS pour toutes les requêtes
app.use(express.json()); // Ligne 10: Permet à Express de parser les requêtes au format JSON

// Ligne 11: Importe les routes d'authentification
const authRoutes = require("./routes/auth");

// Ligne 12: Importe les routes des tâches
const todoRoutes = require("./routes/todo");

// Ligne 13: Utilise les routes d'authentification sous le préfixe /api/auth
app.use("/api/auth", authRoutes);

// Ligne 14: Utilise les routes des tâches sous le préfixe /api/todos
app.use("/api/todos", todoRoutes);

// Ligne 15: Démarre le serveur Express et écoute les connexions sur le port spécifié
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## Models : Définition des Schémas de Données

### Modèle Todo (models/Todo.js)

Ce modèle définit la structure d'une tâche dans notre base de données :

```javascript
// Ligne 1: Importe le module Mongoose
const mongoose = require("mongoose");

// Ligne 2: Définit le schéma pour une tâche
const TodoSchema = new mongoose.Schema({
  text: {
    type: String, // Ligne 3: Le texte de la tâche est une chaîne de caractères
    required: true, // Ligne 4: Le texte est obligatoire
  },
  completed: {
    type: Boolean, // Ligne 5: Indique si la tâche est complétée (true/false)
    default: false, // Ligne 6: Par défaut, une tâche n'est pas complétée
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Ligne 7: Référence à l'ID de l'utilisateur
    ref: "User", // Ligne 8: Indique que cette référence pointe vers le modèle User
    required: true, // Ligne 9: Chaque tâche doit être associée à un utilisateur
  },
  createdAt: {
    type: Date, // Ligne 10: Date de création de la tâche
    default: Date.now, // Ligne 11: Par défaut, la date actuelle
  },
});

// Ligne 12: Exporte le modèle 'Todo' basé sur le TodoSchema
module.exports = mongoose.model("Todo", TodoSchema);
```

### Modèle User (models/User.js)

Ce modèle définit la structure d'un utilisateur, incluant le hachage du mot de passe :

```javascript
// Ligne 1: Importe le module Mongoose
const mongoose = require("mongoose");

// Ligne 2: Importe la bibliothèque bcryptjs pour le hachage des mots de passe
const bcrypt = require("bcryptjs");

// Ligne 3: Définit le schéma pour un utilisateur
const UserSchema = new mongoose.Schema({
  username: {
    type: String, // Ligne 4: Le nom d'utilisateur est une chaîne de caractères
    required: true, // Ligne 5: Le nom d'utilisateur est obligatoire
    unique: true, // Ligne 6: Le nom d'utilisateur doit être unique
  },
  email: {
    type: String, // Ligne 7: L'email de l'utilisateur
    required: true, // Ligne 8: L'email est obligatoire
    unique: true, // Ligne 9: L'email doit être unique
  },
  password: {
    type: String, // Ligne 10: Le mot de passe (haché) est une chaîne de caractères
    required: true, // Ligne 11: Le mot de passe est obligatoire
  },
  createdAt: {
    type: Date, // Ligne 12: Date de création de l'utilisateur
    default: Date.now, // Ligne 13: Par défaut, la date actuelle
  },
});

// Ligne 14: Middleware Mongoose exécuté AVANT la sauvegarde d'un utilisateur
UserSchema.pre("save", async function (next) {
  // Ligne 15: Vérifie si le mot de passe a été modifié (ou est nouveau)
  if (!this.isModified("password")) {
    return next(); // Ligne 16: Si non modifié, passe au middleware suivant
  }

  // Ligne 17: Génère un salt (chaîne aléatoire) pour le hachage
  const salt = await bcrypt.genSalt(10); // Ligne 18: 10 est le coût de hachage

  // Ligne 19: Hache le mot de passe avec le salt généré
  this.password = await bcrypt.hash(this.password, salt);

  // Ligne 20: Passe au middleware suivant
  next();
});

// Ligne 21: Méthode d'instance pour comparer le mot de passe fourni avec le mot de passe stocké
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // Ligne 22: Compare le mot de passe en clair avec le mot de passe haché stocké
  return await bcrypt.compare(enteredPassword, this.password);
};

// Ligne 23: Exporte le modèle 'User' basé sur le UserSchema
module.exports = mongoose.model("User", UserSchema);
```

## Controllers : Logique Métier

### Contrôleur d'Authentification (controllers/authController.js)

Ce contrôleur gère l'inscription et la connexion des utilisateurs :

```javascript
// Ligne 1: Importe le modèle User
const User = require("../models/User");

// Ligne 2: Importe le module jsonwebtoken pour générer des tokens JWT
const jwt = require("jsonwebtoken");

// Ligne 3: Fonction utilitaire pour générer un token JWT
const generateToken = (id) => {
  // Ligne 4: Signe le token avec l'ID de l'utilisateur et la clé secrète JWT
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Ligne 5: Token valide 1 heure
};

// Ligne 6: Contrôleur pour l'inscription d'un nouvel utilisateur
exports.registerUser = async (req, res) => {
  // Ligne 7: Extrait le nom d'utilisateur, l'email et le mot de passe du corps de la requête
  const { username, email, password } = req.body;

  // Ligne 8: Vérifie si l'utilisateur existe déjà par email
  const userExists = await User.findOne({ email });
  if (userExists) {
    // Ligne 9: Si l'utilisateur existe, renvoie une erreur 400
    return res.status(400).json({ message: "User already exists" });
  }

  // Ligne 10: Crée un nouvel utilisateur
  const user = await User.create({
    username,
    email,
    password, // Le mot de passe sera haché par le middleware pre-save du modèle
  });

  // Ligne 11: Si l'utilisateur est créé avec succès
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id), // Ligne 12: Génère et renvoie un token JWT
    });
  } else {
    // Ligne 13: Si la création échoue, renvoie une erreur 400
    res.status(400).json({ message: "Invalid user data" });
  }
};

// Ligne 14: Contrôleur pour la connexion d'un utilisateur existant
exports.loginUser = async (req, res) => {
  // Ligne 15: Extrait l'email et le mot de passe du corps de la requête
  const { email, password } = req.body;

  // Ligne 16: Trouve l'utilisateur par email
  const user = await User.findOne({ email });

  // Ligne 17: Vérifie si l'utilisateur existe et si le mot de passe est correct
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id), // Ligne 18: Génère et renvoie un token JWT
    });
  } else {
    // Ligne 19: Si l'authentification échoue, renvoie une erreur 401 (Non autorisé)
    res.status(401).json({ message: "Invalid email or password" });
  }
};
```

### Contrôleur Todo (controllers/todoController.js)

Ce contrôleur gère les opérations CRUD pour les tâches, en s'assurant que chaque tâche est associée à un utilisateur :

```javascript
// Ligne 1: Importe le modèle Todo
const Todo = require("../models/Todo");

// Ligne 2: Récupère toutes les tâches de l'utilisateur authentifié
exports.getTodos = async (req, res) => {
  try {
    // Ligne 3: Trouve toutes les tâches associées à l'ID de l'utilisateur (req.user.id vient du middleware auth)
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ligne 4: Ajoute une nouvelle tâche pour l'utilisateur authentifié
exports.addTodo = async (req, res) => {
  // Ligne 5: Crée une nouvelle tâche avec le texte fourni et l'ID de l'utilisateur
  const todo = new Todo({
    text: req.body.text,
    user: req.user.id, // Ligne 6: Associe la tâche à l'utilisateur authentifié
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Ligne 7: Met à jour une tâche existante pour l'utilisateur authentifié
exports.updateTodo = async (req, res) => {
  try {
    // Ligne 8: Trouve la tâche par son ID et s'assure qu'elle appartient à l'utilisateur
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });

    if (todo == null) {
      return res.status(404).json({ message: "Todo not found or not authorized" });
    }

    // Ligne 9: Met à jour le statut 'completed' si fourni
    if (req.body.completed != null) {
      todo.completed = req.body.completed;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Ligne 10: Supprime une tâche existante pour l'utilisateur authentifié
exports.deleteTodo = async (req, res) => {
  try {
    // Ligne 11: Trouve et supprime la tâche par son ID et s'assure qu'elle appartient à l'utilisateur
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (todo == null) {
      return res.status(404).json({ message: "Todo not found or not authorized" });
    }

    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

## Routes : Définition des Points d'Accès de l'API

### Routes d'Authentification (routes/auth.js)

Ces routes gèrent l'inscription et la connexion des utilisateurs :

```javascript
// Ligne 1: Importe le module Express et son routeur
const express = require("express");
const router = express.Router();

// Ligne 2: Importe le contrôleur d'authentification
const authController = require("../controllers/authController");

// Ligne 3: Route pour l'inscription d'un nouvel utilisateur (POST /api/auth/register)
router.post("/register", authController.registerUser);

// Ligne 4: Route pour la connexion d'un utilisateur existant (POST /api/auth/login)
router.post("/login", authController.loginUser);

// Ligne 5: Exporte le routeur
module.exports = router;
```

### Routes Todo (routes/todo.js)

Ces routes gèrent les opérations CRUD pour les tâches, protégées par un middleware d'authentification :

```javascript
// Ligne 1: Importe le module Express et son routeur
const express = require("express");
const router = express.Router();

// Ligne 2: Importe le contrôleur Todo
const todoController = require("../controllers/todoController");

// Ligne 3: Importe le middleware d'authentification
const { protect } = require("../middleware/authMiddleware");

// Ligne 4: Route pour récupérer toutes les tâches (GET /api/todos) - Protégée
router.get("/", protect, todoController.getTodos);

// Ligne 5: Route pour ajouter une nouvelle tâche (POST /api/todos) - Protégée
router.post("/", protect, todoController.addTodo);

// Ligne 6: Route pour mettre à jour une tâche (PATCH /api/todos/:id) - Protégée
router.patch("/:id", protect, todoController.updateTodo);

// Ligne 7: Route pour supprimer une tâche (DELETE /api/todos/:id) - Protégée
router.delete("/:id", protect, todoController.deleteTodo);

// Ligne 8: Exporte le routeur
module.exports = router;
```

## Middlewares : Fonctions Intermédiaires

### Middleware d'Authentification (middleware/authMiddleware.js)

Ce middleware vérifie la présence et la validité d'un token JWT dans l'en-tête de la requête. S'il est valide, il attache l'utilisateur à l'objet `req` :

```javascript
// Ligne 1: Importe le module jsonwebtoken
const jwt = require("jsonwebtoken");

// Ligne 2: Importe le modèle User
const User = require("../models/User");

// Ligne 3: Middleware pour protéger les routes
exports.protect = async (req, res, next) => {
  let token;

  // Ligne 4: Vérifie si l'en-tête Authorization contient un token Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Ligne 5: Extrait le token de l'en-tête (format: "Bearer TOKEN")
      token = req.headers.authorization.split(" ")[1];

      // Ligne 6: Vérifie et décode le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ligne 7: Trouve l'utilisateur correspondant à l'ID du token et l'attache à req.user
      req.user = await User.findById(decoded.id).select("-password"); // Exclut le mot de passe

      // Ligne 8: Passe au middleware ou à la route suivante
      next();
    } catch (error) {
      // Ligne 9: Si le token est invalide ou expiré
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // Ligne 10: Si aucun token n'est fourni
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
```

## Démarrage du Serveur Backend

### Configuration de package.json

Assurez-vous que votre fichier `package.json` contient les scripts suivants :

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Lancer le serveur

Pour démarrer votre serveur backend en mode développement, naviguez dans le dossier `mern-auth-todo-backend` et exécutez :

```bash
npm run dev
```

Le serveur devrait démarrer et afficher :
```
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
MongoDB connected successfully
Server running on port 5000
```

## Test de l'API avec Postman/Insomnia

### Inscription d'un Utilisateur (Register)

- **Méthode** : POST
- **URL** : http://localhost:5000/api/auth/register
- **Body (raw, JSON)** :

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Réponse attendue** : Un objet utilisateur avec `_id`, `username`, `email` et un token JWT

### Connexion d'un Utilisateur (Login)

- **Méthode** : POST
- **URL** : http://localhost:5000/api/auth/login
- **Body (raw, JSON)** :

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Réponse attendue** : Un objet utilisateur avec `_id`, `username`, `email` et un token JWT. Copiez ce token, vous en aurez besoin pour les requêtes suivantes.

### Ajout d'une Tâche (Create Todo)

- **Méthode** : POST
- **URL** : http://localhost:5000/api/todos
- **Headers** :
  - Authorization : `Bearer VOTRE_TOKEN_JWT` (remplacez par le token obtenu lors du login)
  - Content-Type : `application/json`
- **Body (raw, JSON)** :

```json
{
  "text": "Apprendre le backend MERN"
}
```

**Réponse attendue** : La tâche créée avec son `_id`, `text`, `completed`, `user` et `createdAt`

### Récupération des Tâches (Get Todos)

- **Méthode** : GET
- **URL** : http://localhost:5000/api/todos
- **Headers** :
  - Authorization : `Bearer VOTRE_TOKEN_JWT`

**Réponse attendue** : Un tableau de toutes les tâches associées à l'utilisateur authentifié

### Mise à Jour d'une Tâche (Update Todo)

- **Méthode** : PATCH
- **URL** : http://localhost:5000/api/todos/ID_DE_LA_TÂCHE (remplacez par l'ID d'une tâche existante)
- **Headers** :
  - Authorization : `Bearer VOTRE_TOKEN_JWT`
  - Content-Type : `application/json`
- **Body (raw, JSON)** :

```json
{
  "completed": true
}
```

**Réponse attendue** : La tâche mise à jour

### Suppression d'une Tâche (Delete Todo)

- **Méthode** : DELETE
- **URL** : http://localhost:5000/api/todos/ID_DE_LA_TÂCHE
- **Headers** :
  - Authorization : `Bearer VOTRE_TOKEN_JWT`

**Réponse attendue** : Un message de confirmation `{"message": "Todo deleted"}`

## Conclusion

Ce guide vous a fourni une base solide pour construire un backend MERN complet avec authentification et CRUD. Chaque composant a été expliqué en détail, ligne par ligne, pour vous permettre de comprendre non seulement quoi faire, mais aussi pourquoi chaque étape est nécessaire.

Les points clés de cette architecture :

1. **Séparation des préoccupations** : Chaque fichier a une responsabilité bien définie
2. **Sécurité** : Utilisation de bcryptjs pour le hachage des mots de passe et JWT pour l'authentification
3. **Maintenabilité** : Configuration centralisée de la base de données
4. **Scalabilité** : Architecture extensible facilitant l'ajout de nouvelles fonctionnalités
5. **Clarté du code** : Chaque ligne est commentée pour faciliter la compréhension

Vous êtes maintenant prêt à appliquer ces concepts à vos propres projets!
