// Ligne 1: Importe le modèle User
const User = require("../models/User");
// Ligne 2: Importe le module jsonwebtoken pour générer des tokens JWT
const jwt = require("jsonwebtoken");
// Ligne 3: Fonction utilitaire pour générer un token JWT
const generateToken = (id) => {
// Ligne 4: Signe le token avec l'ID de l'utilisateur et la clé secrète JWT
return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Ligne
};
// Ligne 6: Contrôleur pour l'inscription d'un nouvel utilisateur
exports.registerUser = async (req, res) => {
// Ligne 7: Extrait le nom d'utilisateur, l'email et le mot de passe du corps
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
token: generateToken(user._id), // Ligne 12: Génère et renvoie un token JW
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
// Ligne 17: Vérifie si l'utilisateur existe et si le mot de passe est correc
if (user && (await user.matchPassword(password))) {
res.json({
_id: user._id,
username: user.username,
email: user.email,
token: generateToken(user._id), // Ligne 18: Génère et renvoie un token JW
});
} else {
// Ligne 19: Si l'authentification échoue, renvoie une erreur 401 (Non auto
res.status(401).json({ message: "Invalid email or password" });
}
};