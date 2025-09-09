// On importe la fonction pour obtenir la connexion à la base MySQL
import { getConnection } from "../db/connection.js";

// On importe le schéma Joi pour valider les données du panier
import { addToCartSchema } from "../validators/cartValidator.js";


// ----------------------------
// Page d’accueil : affiche tous les produits
// ----------------------------
export const showProducts = async (req, res) => {
  try {
    // Récupération de la connexion à la base
    const db = await getConnection();

    // Exécution de la requête SQL pour récupérer tous les produits
    const [products] = await db.query("SELECT * FROM products");

    // Rendu de la page index.twig en passant les produits à afficher
    res.render("index.twig", { products });
  } catch (err) {
    // En cas d'erreur, on l'affiche dans la console et renvoie un code 500
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};


// ----------------------------
// Ajouter un produit au panier
// ----------------------------
export const addToCart = async (req, res) => {
  try {
    // Validation des données envoyées dans le formulaire avec Joi
    const { error, value } = addToCartSchema.validate(req.body);

    // Si les données sont invalides, on renvoie un code 400
    if (error) {
      return res.status(400).send("Données invalides");
    }

    // On récupère l'ID du produit et la quantité validés
    const { productId, quantity } = value;

    // Récupération du panier depuis les cookies (ou création d'un panier vide)
    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

    // Vérifie si le produit est déjà dans le panier
    const existing = cart.find((item) => item.productId === productId);

    if (existing) {
      // Si le produit existe, on incrémente la quantité
      existing.quantity += quantity;
    } else {
      // Sinon, on ajoute le produit au panier
      cart.push({ productId, quantity });
    }

    // On sauvegarde le panier mis à jour dans les cookies (httpOnly pour sécurité)
    res.cookie("cart", JSON.stringify(cart), { httpOnly: true });

    // On redirige l'utilisateur vers la page du panier
    res.redirect("/cart");
  } catch (err) {
    // Gestion des erreurs serveur
    console.error(err);
    res.status(500).send("Erreur ajout panier");
  }
};


// ----------------------------
// Afficher le panier
// ----------------------------
export const showCart = async (req, res) => {
  try {
    // Récupération du panier depuis les cookies
    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

    // Si le panier est vide, on affiche la page avec items vide et total 0
    if (cart.length === 0) {
      return res.render("cart.twig", { items: [], total: 0 });
    }

    // Récupération de tous les produits depuis la base
    const db = await getConnection();
    const [rows] = await db.query("SELECT * FROM products");

    // On associe chaque élément du panier à ses informations produit
    const items = cart.map((c) => {
      // Trouver le produit correspondant dans la base
      const product = rows.find((p) => p.id === c.productId);

      // Retourner un objet avec toutes les infos nécessaires pour l'affichage
      return {
        ...product,                // toutes les infos du produit (id, name, price)
        quantity: c.quantity,      // quantité dans le panier
        subtotal: product.price * c.quantity, // calcul du sous-total
      };
    });

    // Calcul du total général du panier
    const total = items.reduce((sum, i) => sum + i.subtotal, 0);

    // Rendu de la page cart.twig avec les items et le total
    res.render("cart.twig", { items, total });
  } catch (err) {
    // Gestion des erreurs serveur
    console.error(err);
    res.status(500).send("Erreur affichage panier");
  }
};


// ----------------------------
// API JSON du panier
// ----------------------------
export const getCartAPI = (req, res) => {
  // Récupération du panier depuis les cookies
  const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

  // On renvoie le panier en format JSON pour l'API
  res.json(cart);
};
