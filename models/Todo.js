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
type: mongoose.Schema.Types.ObjectId, // Ligne 7: Référence à l'ID de l'uti
ref: "User", // Ligne 8: Indique que cette référence pointe vers le modèle
required: true, // Ligne 9: Chaque tâche doit être associée à un utilisateu
},
createdAt: {
type: Date, // Ligne 10: Date de création de la tâche
default: Date.now, // Ligne 11: Par défaut, la date actuelle
},
});
// Ligne 12: Exporte le modèle 'Todo' basé sur le TodoSchema
module.exports = mongoose.model("Todo", TodoSchema);