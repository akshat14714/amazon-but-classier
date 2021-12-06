const Product = require("../models/product");
const Category = require("../models/category");
const Cart = require("../models/cart");
const Order = require("../models/order");


async function getHomePage(req, res, next) {
    try {
        const products = await Product.find({})
          .sort("-createdAt")
          .populate("category");
        res.render("shop/home", { pageName: "Home", products });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
}

module.exports = {
    getHomePage
}
