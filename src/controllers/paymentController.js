// On importe la librairie Stripe pour gérer les paiements
import Stripe from "stripe";

// On importe la fonction pour récupérer la connexion MySQL
import { getConnection } from "../db/connection.js";

// Initialisation de Stripe avec la clé secrète stockée dans .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// ----------------------------
// Créer une session Stripe Checkout
// ----------------------------
export const checkout = async (req, res) => {
  try {
    // Récupération du panier depuis les cookies (ou panier vide)
    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

    // Si le panier est vide, on renvoie un code 400
    if (cart.length === 0) {
      return res.status(400).send("Panier vide");
    }

    // Récupération de tous les produits depuis la base de données
    const db = await getConnection();
    const [rows] = await db.query("SELECT * FROM products");

    // Transformation du panier en format attendu par Stripe
    const lineItems = cart.map((c) => {
      // On retrouve le produit correspondant dans la base
      const product = rows.find((p) => p.id === c.productId);

      // On crée l'objet ligne pour Stripe
      return {
        price_data: {
          currency: "eur",          // devise
          product_data: { name: product.name }, // nom du produit
          unit_amount: product.price, // prix en centimes
        },
        quantity: c.quantity,        // quantité
      };
    });

    // Création d'une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // types de paiement acceptés
      line_items: lineItems,           // lignes de commande
      mode: "payment",                 // paiement unique
      success_url: `${req.protocol}://${req.get("host")}/success`, // redirection succès
      cancel_url: `${req.protocol}://${req.get("host")}/cancel`,   // redirection annulation
    });

    // Redirection de l'utilisateur vers Stripe pour le paiement
    res.redirect(303, session.url);
  } catch (err) {
    // Gestion des erreurs serveur
    console.error(err);
    res.status(500).send("Erreur paiement");
  }
};


// ----------------------------
// Page succès
// ----------------------------
export const success = (req, res) => {
  // On vide le panier après un paiement réussi
  res.clearCookie("cart");

  // Affichage de la page Twig de confirmation
  res.render("success.twig");
};


// ----------------------------
// Page annulation
// ----------------------------
export const cancel = (req, res) => {
  // Affichage de la page Twig d'annulation
  res.render("cancel.twig");
};
