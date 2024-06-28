const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError = require('./utils/ExpressError');
const { listingSchema,reviewSchema  } = require("./schema");

// middleware.js
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.savedUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
        {
            res.locals.redirectUrl=req.session.redirectUrl;
        }
        next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
       req.flash("error","You don't have perrmission to access it");
       return res.redirect(`/listings/${id}`);
    }
   next();
}

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

  module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currentUser._id)){
       req.flash("error","You don't have perrmission to access it");
       return res.redirect(`/listings/${id}`);
    }
   next();
}