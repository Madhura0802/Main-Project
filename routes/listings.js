const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});
// =======================================================================================
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Index Route and Add route
router.route("/")
.get(wrapAsync(listingController.index))
.post(
   upload.single("listing[image]"),
  validateListing,
  isLoggedIn,
  wrapAsync(listingController.createListing),
);


//NEW Listing
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

//Read particular listing & Update listing & delete listing
router.route("/:id")
.get( isLoggedIn, wrapAsync(listingController.showListing))
.put(
    upload.single("listing[image]"),
  validateListing,
  isLoggedIn,
  wrapAsync(listingController.updateListing),
)
.delete(isLoggedIn, wrapAsync(listingController.destroyListing));



//Edit Listng
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.renderEditForm),
);



module.exports = router;
