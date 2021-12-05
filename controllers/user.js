const Order = require("../models/order");
const Cart = require("../models/cart");

function getSignupPage(req, res) {
    console.log("Inside User Controller!");
    var errorMsg = req.flash("error")[0];
	res.render("user/signup", {
		csrfToken: req.csrfToken(),
		errorMsg,
		pageName: "Sign Up",
	});
}

async function postSignup(req, res) {
    try {
        //if there is cart session, save it to the user's cart in db
        if (req.session.cart) {
            let cart = await new Cart(req.session.cart);
            cart.user = req.user._id;
            await cart.save();
        }
        // redirect to the previous URL
        if (req.session.oldUrl) {
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);
        } else {
            res.redirect("/user/profile");
        }
    } catch (err) {
        console.log(err);
        req.flash("error", err.message);
        return res.redirect("/");
    }
}

function getLoginPage(req, res) {
    var errorMsg = req.flash("error")[0];
	res.render("user/signin", {
		csrfToken: req.csrfToken(),
		errorMsg,
		pageName: "Sign In",
	});
}

async function postLogin(req, res) {
    try {
        // cart logic when the user logs in
        let cart = await Cart.findOne({ user: req.user._id });
        // if there is a cart session and user has no cart, save it to the user's cart in db
        if (req.session.cart && !cart) {
            const cart = await new Cart(req.session.cart);
            cart.user = req.user._id;
            await cart.save();
        }
        // if user has a cart in db, load it to session
        if (cart) {
            req.session.cart = cart;
        }
        // redirect to old URL before signing in
        if (req.session.oldUrl) {
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);
        } else {
            res.redirect("/");
        }
    } catch (err) {
        console.log(err);
        req.flash("error", err.message);
        return res.redirect("/");
    }
}

async function getProfile(req, res) {
    let successMsg = req.flash("success")[0];
	let errorMsg = req.flash("error")[0];
	try {
		allOrders = await Order.find({ user: req.user });
		res.render("user/profile", {
            orders: allOrders,
            errorMsg,
            successMsg,
            pageName: "User Profile",
		});
	} catch (err) {
		console.log(err);
		return res.redirect("/");
	}
}

function postLogout(req, res) {
    req.logout();
	req.session.cart = null;
	res.redirect("/");
}

module.exports = {
    getSignupPage,
    postSignup,
    getLoginPage,
    postLogin,
    getProfile,
    postLogout
};
