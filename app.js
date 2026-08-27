if(process.env.NODE_ENV!="production"){
  require("dotenv").config()
}


const express = require("express");
const app = express();
app.set("trust proxy", 1);
const mongoose = require("mongoose");
const methodOverride = require("method-override");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const db_URL=process.env.ATLASDB_URL;
const db_URL =
  process.env.NODE_ENV === "production"
    ? process.env.ATLASDB_URL
    : "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo').default;
const flash=require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { error } = require("console");

// =============================================================================================

async function main() {
 await mongoose.connect(db_URL);
}

main()
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: db_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
  console.log("Error in mongo store",err)
})

let sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:false,
  cookie: {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  maxAge: 7 * 24 * 60 * 60 * 1000,
}
};


app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());

app.use(passport.session());

app.use((req, res, next) => {
  console.log("req.session.passport:", req.session.passport);
  console.log("req.user:", req.user);
  next();
});

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
 res.locals.currentUser = req.user;
  next();
})
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);




// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error handler
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.render("listings/error.ejs", { message });
  // res.status(status).send(message);
});

app.listen(8080, () => {
  console.log("App is listening on port 8080");
});
