// Ligne 1: Importe le module Express et son routeur
const express = require("express");
const router = express.Router();
// Ligne 2: Importe le contrôleur d'authentification
const authController = require("../controllers/authController");
// Ligne 3: Route pour l'inscription d'un nouvel utilisateur (POST /api/auth/reg
router.post("/register", authController.registerUser);
// Ligne 4: Route pour la connexion d'un utilisateur existant (POST /api/auth/lo
router.post("/login", authController.loginUser);
// Ligne 5: Exporte le routeur
module.exports = router;