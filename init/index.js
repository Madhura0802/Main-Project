const mongoose=require("mongoose");
const initData=require("./data")
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const Listing=require("../models/listings.js")

async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });

  const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6a1413b26709ac23f9859b5e"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized!")
  }

  initDB();