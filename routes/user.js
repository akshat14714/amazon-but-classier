const express = require("express");
const router = express.Router();
const csrf = require("csurf");
var passport = require("passport");
const middleware = require("../middleware/authenticated");

const userController = require('../controllers/user');

const {
	userSignUpValidationRules,
	userSignInValidationRules,
	validateSignup,
	validateSignin,
} = require("../config/validator");

router.use(csrf());

router.get("/signup", middleware.isNotLoggedIn, userController.getSignupPage);

router.post("/signup", [middleware.isNotLoggedIn, userSignUpValidationRules(), validateSignup, passport.authenticate("local.signup", {
	successRedirect: "/user/profile",
	failureRedirect: "/user/signup",
	failureFlash: true,
})], userController.postSignup);

router.get("/signin", middleware.isNotLoggedIn, userController.getLoginPage);

router.post("/signin", [middleware.isNotLoggedIn, userSignInValidationRules(), validateSignin, passport.authenticate("local.signin", {
	failureRedirect: "/user/signin",
	failureFlash: true,
})], userController.postLogin);

router.get("/profile", middleware.isLoggedIn, userController.getProfile);

router.get("/logout", middleware.isLoggedIn, userController.postLogout);

module.exports = router;
