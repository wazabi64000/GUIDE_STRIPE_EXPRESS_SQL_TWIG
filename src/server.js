// Importation des modules nécessaires
import express from "express";        // Framework Express pour créer le serveur
import cookieParser from "cookie-parser"; // Middleware pour gérer les cookies
import dotenv from "dotenv";          // Pour charger les variables d'environnement depuis .env
import path from "path";              // Module Node.js pour gérer les chemins de fichiers

// Importation des routes (panier et paiement)
import cartRoutes from "./routes/cart.js";
import paymentRoutes from "./routes/payment.js";

// Chargement des variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000; // Port défini dans .env ou 3000 par défaut


// ----------------------------
// Middlewares globaux
// ----------------------------

// Permet de traiter les requêtes JSON
app.use(express.json());

// Permet de traiter les données envoyées depuis un formulaire (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Active la gestion des cookies (lecture et écriture)
app.use(cookieParser());

// Déclare le dossier "public" pour les fichiers statiques (CSS, images, JS côté client)
app.use(express.static(path.join(process.cwd(), "src/public")));


// ----------------------------
// Configuration de Twig
// ----------------------------

// Définir le dossier où se trouvent les vues (fichiers .twig)
app.set("views", path.join(process.cwd(), "src/views"));

// Définir Twig comme moteur de rendu
app.set("view engine", "twig");


// ----------------------------
// Routes de l'application
// ----------------------------

// Routes du panier (produits, panier, API panier)
app.use("/", cartRoutes);

// Routes du paiement (checkout, success, cancel)
app.use("/", paymentRoutes);


// ----------------------------
// Gestion des erreurs 404
// ----------------------------

// Middleware exécuté si aucune route n'a répondu
app.use((req, res) => {
  res.status(404).send("Page not found");
});


// ----------------------------
// Démarrage du serveur
// ----------------------------

// On lance le serveur sur le port défini
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
