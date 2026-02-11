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
// Ligne 5: Extrait le token de l'en-tête
token = req.headers.authorization.split(" ")[1];
// Ligne 6: Vérifie et décode le token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// Ligne 7: Trouve l'utilisateur correspondant à l'ID du token et l'attach
req.user = await User.findById(decoded.id).select("-password"); // Exclut
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