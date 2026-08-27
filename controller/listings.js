const Listing=require("../models/listings");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });


module.exports.index=async(req,res)=>{
    const allListings=await Listing.find();
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=async(req,res)=>{
  res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested , Does not existed!");
         return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async (req, res) => {

  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let filename = req.file.filename;

  let url = req.file.path;

  const newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id;

  newListing.image = { filename, url };

  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();

  req.flash("success", "New Listing Created Successfully!");

  res.redirect("/listings");
};


module.exports.renderEditForm=async(req,res)=>{
   let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested , Does not existed!");
        return res.redirect("/listings");
    }

    let originalImage=listing.image.url;
  originalImage = originalImage.replace("/upload","/upload/w_300");
  res.render("listings/edit.ejs",{listing,originalImage})
}

module.exports.updateListing = async (req, res) => {

    let { id } = req.params;

    let listing = req.body.listing;

    let list = await Listing.findById(id);

    if (!list.owner._id.equals(res.locals.currentUser._id)) {

        req.flash("error", "You don't have permission to edit");

        return res.redirect(`/listings/${id}`);
    }

    if (req.file) {

        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await Listing.findByIdAndUpdate(id, listing);

    req.flash("success", "Listing Updated Successfully!!");

    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
   let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
      req.flash("success","Listing Deleted Succesfully!!")
    res.redirect("/listings")
}