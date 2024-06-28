const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedUrl } = require("../middleware");
const userController = require('../controller/user');

// Render the signup form & Handle signup logic
router.route('/signup')
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup)); // Corrected here

// Render the login form & Handle login logic
router.route('/login')
    .get(userController.renderLoginForm)
    .post(savedUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }), userController.login);

// Logout
router.get("/logout", userController.logout);

module.exports = router;
