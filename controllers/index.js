const Product = require("../models/product");
const Category = require("../models/category");
const Cart = require("../models/cart");
const Order = require("../models/order");
const Payment = require('../models/payment');


async function getHomePage(req, res, next) {
	try {
		const products = await Product.find({ delete: false })
			.sort("-createdAt")
			.populate("category");
		res.render("shop/home", { pageName: "Home", products });
	} catch (error) {
		console.log(error);
		res.redirect("/");
	}
}

async function addItemToCart(req, res, next) {
	const productId = req.params.id;
	try {
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

		const product = await Product.findById(productId);
		const itemIndex = cart.items.findIndex((p) => p.productId == productId);
		if (itemIndex > -1) {
			cart.items[itemIndex].quantity++;
			cart.items[itemIndex].totalCost = cart.items[itemIndex].quantity * product.price;
			cart.totalQuantity++;
			cart.totalCost += product.price;
			console.log("cart::: " + JSON.stringify(cart));
		} else {
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


async function getShoppingCart(req, res, next) {
	try {
		let cart_user;
		if (req.user) {
			cart_user = await Cart.findOne({ user: req.user._id });
		}
		if (req.user && cart_user) {
			req.session.cart = cart_user;
			return res.render("shop/shopping-cart", {
				cart: cart_user,
				pageName: "Shopping Cart",
				products: await productsFromCart(cart_user),
			});
		}
		if (!req.session.cart) {
			return res.render("shop/shopping-cart", {
				cart: null,
				pageName: "Shopping Cart",
				products: null,
			});
		}
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
	const productId = req.params.id;
	let cart;
	try {
		if (req.user) {
			cart = await Cart.findOne({ user: req.user._id });
		} else if (req.session.cart) {
			cart = await new Cart(req.session.cart);
		}

		let itemIndex = cart.items.findIndex((p) => p.productId == productId);
		if (itemIndex > -1) {
			const product = await Product.findById(productId);
			cart.items[itemIndex].quantity--;
			cart.items[itemIndex].totalCost -= product.price;
			cart.totalQuantity--;
			cart.totalCost -= product.price;
			if (cart.items[itemIndex].quantity <= 0) {
				await cart.items.remove({ _id: cart.items[itemIndex]._id });
			}
			req.session.cart = cart;
			if (req.user) {
				await cart.save();
			}
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
		let itemIndex = cart.items.findIndex((p) => p.productId == productId);
		if (itemIndex > -1) {
			cart.totalQuantity -= cart.items[itemIndex].quantity;
			cart.totalCost -= cart.items[itemIndex].totalCost;
			await cart.items.remove({ _id: cart.items[itemIndex]._id });
		}
		req.session.cart = cart;
		if (req.user) {
			await cart.save();
		}
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

async function getCheckoutPage(req, res, next) {
	const errorMsg = req.flash("error")[0];

	if (!req.session.cart) {
		return res.redirect("/shopping-cart");
	}
	cart = await Cart.findById(req.session.cart._id);

	const errMsg = req.flash("error")[0];
	res.render("shop/checkout", {
		total: cart.totalCost,
		csrfToken: req.csrfToken(),
		errorMsg,
		pageName: "Checkout",
	});
}

async function checkoutAndPay(req, res, next) {
	if (!req.session.cart) {
		return res.redirect("/shopping-cart");
	}

	const cart = await Cart.findById(req.session.cart._id);

	for (let i = 0; i < cart.items.length; i++) {
		var prodId = cart.items[i].productId;
		const product = await Product.findById(prodId);
		product.quantity -= cart.items[i].quantity;
		product.quantity = Math.max(0, product.quantity);
		await product.save();
	}

	const payment = new Payment({
		user: req.user,
		amount: cart.totalCost
	});

	await payment.save();

	const order = new Order({
		user: req.user,
		cart: {
			totalQuantity: cart.totalQuantity,
			totalCost: cart.totalCost,
			items: cart.items,
		},
		address: req.body.address,
		paymentId: payment._id
	});

	order.save(async (err, newOrder) => {
		if (err) {
			console.log(err);
			return res.redirect("/checkout");
		}
		await cart.save();
		await Cart.findByIdAndDelete(cart._id);
		req.flash("success", "Successfully purchased");
		req.session.cart = null;
		res.redirect("/user/profile");
	});
}

async function productsFromCart(cart) {
	let products = [];
	for (const item of cart.items) {
		let foundProduct = (
			await Product.findById(item.productId).populate("category")
		).toObject();

		foundProduct["quantity"] = item.quantity;
		foundProduct["totalPrice"] = item.totalCost;
		products.push(foundProduct);
	}
	console.log(products);
	return products;
}

module.exports = {
	getHomePage,
	addItemToCart,
	getShoppingCart,
	reduceCartItem,
	removeAllItems,
	getCheckoutPage,
	checkoutAndPay
}
