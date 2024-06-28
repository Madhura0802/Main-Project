const User=require('../models/user');
module.exports.renderSignupForm= (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect('/listings');
        })
       
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('/signup');
    }
};

module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs");
};

module.exports.login=(req, res) => {
    req.flash("success", "Welcome Back to Wanderlust!");
   let redirectUrl=res.locals.redirect || "/listings";
   res.redirect(redirectUrl);
};

module.exports.logout=(req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash("success", "You have logged out successfully.");
      res.redirect("/listings");
    });
  };