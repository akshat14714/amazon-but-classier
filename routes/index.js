const express = require("express");
const csrf = require("csurf");
// const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const Product = require("../models/product");
const Category = require("../models/category");
const Cart = require("../models/cart");
const Order = require("../models/order");
const middleware = require("../middleware/authenticated");
const router = express.Router();

const indexController = require('../controllers/index');

const csrfProtection = csrf();
router.use(csrfProtection);

router.get("/", indexController.getHomePage);

router.get("/add-to-cart/:id", indexController.addItemToCart);

router.get("/shopping-cart", indexController.getShoppingCart);

router.get("/reduce/:id", indexController.reduceCartItem);

router.get("/removeAll/:id", indexController.removeAllItems);

router.get("/checkout", middleware.isLoggedIn, indexController.getCheckoutPage);

router.post("/checkout", middleware.isLoggedIn, indexController.checkoutAndPay);

module.exports = router;
