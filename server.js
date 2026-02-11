//Ligne 1: Charge les variables d'environnement du fichier .env dans process.en
require("dotenv").config();
// Ligne 2: Importe le module Express pour créer et gérer le serveur web
const express = require("express");
// Ligne 3: Importe la fonction de connexion à MongoDB
const connectDB = require("./config/db");
// Ligne 4: Importe le middleware CORS pour gérer les requêtes cross-origin
const cors = require("cors");
// Ligne 5: Crée une instance de l'application Express
const app = express();
// Ligne 6: Définit le port du serveur, en utilisant la variable d'environnemen
const PORT = process.env.PORT || 5000;
// Ligne 7: Connexion à MongoDB
connectDB();
// Ligne 12: Middlewares globaux
app.use(cors()); // Ligne 13: Active CORS pour toutes les requêtes
app.use(express.json()); // Ligne 14: Permet à Express de parser les requêtes au
// Ligne 15: Importe les routes d'authentification
const authRoutes = require("./routes/auth");
// Ligne 16: Importe les routes des tâches
const todoRoutes = require("./routes/todo");
// Ligne 17: Utilise les routes d'authentification sous le préfixe /api/auth
app.use("/api/auth", authRoutes);
// Ligne 18: Utilise les routes des tâches sous le préfixe /api/todos
app.use("/api/todos", todoRoutes);
// Ligne 19: Démarre le serveur Express et écoute les connexions sur le port spé
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));