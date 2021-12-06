const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
var moment = require("moment");

const productController = require('../controllers/product');

router.get('/', productController.getAllProducts)

router.get('/search', productController.searchProduct);

router.get("/:slug", productController.getProductsForCategory);

router.get("/:slug/:id", productController.getProductById);

module.exports = router;
