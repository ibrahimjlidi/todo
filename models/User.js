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
type: String, // Ligne 10: Le mot de passe (haché) est une chaîne de caractè
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
// Ligne 21: Méthode d'instance pour comparer le mot de passe fourni avec le mo
UserSchema.methods.matchPassword = async function (enteredPassword) {
// Ligne 22: Compare le mot de passe en clair avec le mot de passe haché stoc
return await bcrypt.compare(enteredPassword, this.password);
};
// Ligne 23: Exporte le modèle 'User' basé sur le UserSchema
module.exports = mongoose.model("User", UserSchema);