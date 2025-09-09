#  Mini E-commerce avec Express, MySQL et Stripe

##  Description
Ce projet est un mini e-commerce utilisant **Express (ESM)** avec un panier géré par **cookies**, validé avec **Joi**, et un paiement en ligne via **Stripe Checkout**.  
Les vues sont rendues avec **Twig**, et les données produits sont stockées dans **MySQL**.

---

##  Outils & Dépendances
- **Node.js** ( +22 recommandé)
- **Express** (framework web)
- **mysql2/promise** (connexion à MySQL)
- **twig** (moteur de templates)
- **stripe** (paiement en ligne)
- **cookie-parser** (gestion des cookies)
- **joi** (validation de données)
- **dotenv** (gestion des variables d'environnement)

---

##  Architecture du projet
express-stripe-shop/
│── src/
│ ├── server.js # Point d’entrée
│ ├── routes/ # Routes Express
│ │ ├── cart.js
│ │ └── payment.js
│ ├── controllers/ # Logique métier
│ │ ├── cartController.js
│ │ └── paymentController.js
│ ├── db/ # Connexior.json MySQL
│ │ └── connection.js
│ ├── validators/ # Validation Joi
│ │ └── cartValidator.js
│ ├── views/ # Templates Twig
│ │ ├── index.twig
│ │ ├── cart.twig
│ │ ├── success.twig
│ │ └── cancel.twig
│ └── public/ # Fichiers statiques
│ └── css/
│
│── tests/ # Tests API
│── .env # Variables d'environnement
│── .gitignore
│── README.md
│── package.json


│── package.json

# .env

# Serveur
PORT=3000

# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=passord
DB_NAME=shop_db

# Stripe
STRIPE_SECRET_KEY=sk_test_yourkey
STRIPE_PUBLIC_KEY=pk_test_yourkey


---

##  Installation & Lancement

```bashli
# Installer les dépendances
npm install

# Configurer la base MySQL
# Créer une DB `shop_db` et insérer un produit test
mysql -u root -p -e "CREATE DATABASE shop_db;"
mysql -u root -p shop_db -e "CREATE TABLE products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), price INT);"
mysql -u root -p shop_db -e "INSERT INTO products (name, price) VALUES ('Produit Test', 1500);"

# Lancer le serveur
npm start
