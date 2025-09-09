// On importe la librairie mysql2 avec support des Promises
import mysql from "mysql2/promise";

// On importe dotenv pour charger les variables d'environnement depuis .env
import dotenv from "dotenv";

// Chargement des variables d'environnement
dotenv.config();

// Déclaration d'une variable pour le pool de connexions
let pool;

// Fonction pour obtenir le pool de connexion à la base
export const getConnection = async () => {
  // Si le pool n'existe pas encore, on le crée
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,       // hôte de la base (ex: localhost)
      user: process.env.DB_USER,       // utilisateur MySQL
      password: process.env.DB_PASSWORD, // mot de passe
      database: process.env.DB_NAME,   // nom de la base à utiliser
      waitForConnections: true,        // attendre si toutes les connexions sont utilisées
      connectionLimit: 10,             // nombre maximum de connexions simultanées
      queueLimit: 0,                   // pas de limite pour la file d'attente
    });

    // Message console pour confirmer la création du pool
    console.log(" MySQL pool a été créé ");
  }

  // Retourne le pool pour être utilisé dans le reste de l'application
  return pool;
};
