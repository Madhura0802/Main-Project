const User=require("../models/user");


module.exports.renderSignUpForm= async (req, res) => {
  res.render("users/signUp.ejs");
}

module.exports.signUp = async (req, res, next) => {
  const { username, password, email } = req.body;

  const newUser = new User({ email, username });

  const registeredUser = await User.register(newUser, password);

  req.login(registeredUser, (err) => {
    if (err) return next(err);

    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
  });
};

// module.exports.signUp=async (req, res,next) => {
//     console.log("next =", next);
//     try {
//       let { username, email, password } = req.body;
//       const newUser = new User({ email, username });
//       const registeredUser = await User.register(newUser, password);
//       req.login(registeredUser, (err) => {
//         if (err) {
//           return next(err);
//         }

//         req.flash("success", "Welcome to Wanderlust");
//         res.redirect("/listings");
//       });
//     } catch (e) {
//       req.flash("error", e.message);
//       res.redirect("/signUp");
//     }
//   }


  module.exports.renderLoginForm=async (req, res) => {
  res.render("users/login.ejs");
}

module.exports.login= async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");

    let redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
  }

  module.exports.logout=(req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You're Logout Succesfully!");
    res.redirect("/listings");
  });
}