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