// Ligne 1: Importe le modèle Todo
const Todo = require("../models/Todo");
// Ligne 2: Récupère toutes les tâches de l'utilisateur authentifié
exports.getTodos = async (req, res) => {
try {
// Ligne 3: Trouve toutes les tâches associées à l'ID de l'utilisateur (req
const todos = await Todo.find({ user: req.user.id });
res.json(todos);
} catch (err) {
res.status(500).json({ message: err.message });
}
};

// Ligne 4: Ajoute une nouvelle tâche pour l'utilisateur authentifié
exports.addTodo = async (req, res) => {
// Ligne 5: Crée une nouvelle tâche avec le texte fourni et l'ID de l'utilisa
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
    // Ligne 8: Trouve la tâche par son ID et s'assure qu'elle appartient à l'utilisateur authentifié
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
// Ligne 11: Trouve et supprime la tâche par son ID et s'assure qu'elle appartient à l'utilisateur authentifié
const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
if (todo == null) {
return res.status(404).json({ message: "Todo not found or not authorized" });
}
res.json({ message: "Todo deleted" });
} catch (err) {
res.status(500).json({ message: err.message });
}
};