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

async function addItemToCart(req, res, next){
    const productId = req.params.id;
    try {
      // get the correct cart, either from the db, session, or an empty cart.
      let user_cart;
      if (req.user) {
        user_cart = await Cart.findOne({ user: req.user._id });
      }
      let cart;
      if (
        (req.user && !user_cart && req.session.cart) ||
        (!req.user && req.session.cart)
      ) {
        cart = await new Cart(req.session.cart);
      } else if (!req.user || !user_cart) {
        cart = new Cart({});
      } else {
        cart = user_cart;
      }
  
      // add the product to the cart
      const product = await Product.findById(productId);
      const itemIndex = cart.items.findIndex((p) => p.productId == productId);
      if (itemIndex > -1) {
        // if product exists in the cart, update the quantity
        cart.items[itemIndex].quantity++;
        cart.items[itemIndex].totalCost = cart.items[itemIndex].quantity * product.price;
        cart.totalQuantity++;
        cart.totalCost += product.price;
        console.log("cart::: " + JSON.stringify(cart));
      } else {
        // if product does not exists in cart, find it in the db to retrieve its price and add new item
        cart.items.push({
          productId: productId,
          productCode: product.productCode,
          quantity: 1,
          price: product.price,
          totalCost: product.price,
          title: product.title,
          productCode: product.productCode,
        });
        cart.totalQuantity++;
        cart.totalCost += product.price;
      }
  
      // if the user is logged in, store the user's id and save cart to the db
      if (req.user) {
        cart.user = req.user._id;
        await cart.save();
      }
      req.session.cart = cart;
      req.flash("success", "Item added to the shopping cart");
      res.redirect(req.headers.referer);
    } catch (err) {
      console.log(err.message);
      res.redirect("/");
    }
}


async function getShoppingCart(req, res, next){
    try {
        // find the cart, whether in session or in db based on the user state
        let cart_user;
        if (req.user) {
          cart_user = await Cart.findOne({ user: req.user._id });
        }
        // if user is signed in and has cart, load user's cart from the db
        if (req.user && cart_user) {
          req.session.cart = cart_user;
          return res.render("shop/shopping-cart", {
            cart: cart_user,
            pageName: "Shopping Cart",
            products: await productsFromCart(cart_user),
          });
        }
        // if there is no cart in session and user is not logged in, cart is empty
        if (!req.session.cart) {
          return res.render("shop/shopping-cart", {
            cart: null,
            pageName: "Shopping Cart",
            products: null,
          });
        }
        // otherwise, load the session's cart
        return res.render("shop/shopping-cart", {
          cart: req.session.cart,
          pageName: "Shopping Cart",
          products: await productsFromCart(req.session.cart),
        });
      } catch (err) {
        console.log(err.message);
        res.redirect("/");
      }
}

async function reduceCartItem(req, res, next) {
    // if a user is logged in, reduce from the user's cart and save
    // else reduce from the session's cart
    const productId = req.params.id;
    let cart;
    try {
      if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
      } else if (req.session.cart) {
        cart = await new Cart(req.session.cart);
      }
  
      // find the item with productId
      let itemIndex = cart.items.findIndex((p) => p.productId == productId);
      if (itemIndex > -1) {
        // find the product to find its price
        const product = await Product.findById(productId);
        // if product is found, reduce its quantity
        cart.items[itemIndex].quantity--;
        cart.items[itemIndex].totalCost -= product.price;
        cart.totalQuantity--;
        cart.totalCost -= product.price;
        // if the item's quantity reaches 0, remove it from the cart
        if (cart.items[itemIndex].quantity <= 0) {
          await cart.items.remove({ _id: cart.items[itemIndex]._id });
        }
        req.session.cart = cart;
        //save the cart it only if user is logged in
        if (req.user) {
          await cart.save();
        }
        //delete cart if quantity is 0
        if (cart.totalQuantity <= 0) {
          req.session.cart = null;
          await Cart.findByIdAndRemove(cart._id);
        }
      }
      res.redirect(req.headers.referer);
    } catch (err) {
      console.log(err.message);
      res.redirect("/");
    }
  }
  async function removeAllItems(req, res, next) {
    const productId = req.params.id;
    let cart;
    try {
      if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
      } else if (req.session.cart) {
        cart = await new Cart(req.session.cart);
      }
      //fnd the item with productId
      let itemIndex = cart.items.findIndex((p) => p.productId == productId);
      if (itemIndex > -1) {
        //find the product to find its price
        cart.totalQuantity -= cart.items[itemIndex].quantity;
        cart.totalCost -= cart.items[itemIndex].totalCost;
        await cart.items.remove({ _id: cart.items[itemIndex]._id });
      }
      req.session.cart = cart;
      //save the cart it only if user is logged in
      if (req.user) {
        await cart.save();
      }
      //delete cart if quantity is 0
      if (cart.totalQuantity <= 0) {
        req.session.cart = null;
        await Cart.findByIdAndRemove(cart._id);
      }
      res.redirect(req.headers.referer);
    } catch (err) {
      console.log(err.message);
      res.redirect("/");
    }
  }

module.exports = {
    getHomePage,
    addItemToCart,
    getShoppingCart,
    reduceCartItem,
    removeAllItems
}
