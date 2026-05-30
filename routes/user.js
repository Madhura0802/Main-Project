const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const usersController=require("../controller/users")
// ===================================================================================================
router.route("/signUp")
.get(usersController.renderSignUpForm)
.post(
  wrapAsync(usersController.signUp),
);

router.route("/login")
.get(usersController.renderLoginForm)
.post(
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  saveRedirectUrl,
 usersController.login
);

router.get("/logout", usersController.logout);

module.exports = router;
