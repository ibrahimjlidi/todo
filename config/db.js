/**
 * Configuration de la Base de Données MongoDB
 * 
 * Ce fichier gère la connexion à MongoDB de manière centralisée.
 * En suivant le pattern MVC, la logique de connexion est séparée du point d'entrée (server.js)
 * pour une meilleure organisation et maintenabilité du code.
 * 
 * Prérequis:
 * - MongoDB installé et fonctionnel (ou un compte MongoDB Atlas)
 * - Variable d'environnement MONGO_URI configurée dans le fichier .env
 * 
 * Format du MONGO_URI:
 * - Local: mongodb://localhost:27017/mernauthtodo
 * - Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname
 */

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
