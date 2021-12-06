const { check, validationResult } = require("express-validator");

const userSignUpValidationRules = () => {
	return [
		check("name", "Name is required").not().isEmpty(),
		check("email", "Invalid email").not().isEmpty().isEmail(),
		check("password", "Please enter a password with 8 or more characters, atleast one uppercase letter, one lowercase letter, one digit and one special character")
		.not()
		.isEmpty()
		.isLength({ min: 8 })
		.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
	];
};

const userSignInValidationRules = () => {
	return [
		check("email", "Invalid email").not().isEmpty().isEmail(),
		check("password", "Invalid password").not().isEmpty().isLength({ min: 4 }),
	];
};

const validateSignup = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		var messages = [];
		errors.array().forEach((error) => {
		messages.push(error.msg);
		});
		req.flash("error", messages);
		return res.redirect("/user/signup");
	}
	next();
};

const validateSignin = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		var messages = [];
		errors.array().forEach((error) => {
		messages.push(error.msg);
		});
		req.flash("error", messages);
		return res.redirect("/user/signin");
	}
	next();
};

module.exports = {
  userSignUpValidationRules,
  userSignInValidationRules,
  validateSignup,
  validateSignin
};
