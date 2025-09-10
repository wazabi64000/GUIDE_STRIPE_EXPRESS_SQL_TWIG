// server.secure.js

// ----------------------------
// Import des dépendances
// ----------------------------
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import cartRoutes from "./routes/cart.js";
import paymentRoutes from "./routes/payment.js";

// Charger les variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------------
// Middlewares de sécurité
// ----------------------------

// Helmet : sécurise les en-têtes HTTP
app.use(helmet());

// Limiteur de requêtes : protège contre le spam / attaques par force brute
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // max 100 requêtes par IP
});
app.use(limiter);

// ----------------------------
// Middlewares globaux
// ----------------------------

// Pour traiter les requêtes JSON
app.use(express.json());

// Pour traiter les données des formulaires
app.use(express.urlencoded({ extended: true }));

// Cookies sécurisés et signés
app.use(cookieParser(process.env.COOKIE_SECRET));

// Dossier public pour les fichiers statiques
app.use(express.static(path.join(process.cwd(), "src/public")));

// ----------------------------
// Configuration de Twig
// ----------------------------
app.set("views", path.join(process.cwd(), "src/views"));
app.set("view engine", "twig");

// ----------------------------
// Routes
// ----------------------------
app.use("/", cartRoutes);
app.use("/", paymentRoutes);

// ----------------------------
// 404 Not Found
// ----------------------------
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// ----------------------------
// Middleware global de gestion des erreurs
// ----------------------------
app.use((err, req, res, next) => {
  console.error("Erreur serveur :", err.stack);
  res.status(500).send("Erreur interne du serveur");
});

// ----------------------------
// Démarrage du serveur
// ----------------------------
app.listen(PORT, () => {
  console.log(`Serveur sécurisé démarré sur http://localhost:${PORT}`);
});
