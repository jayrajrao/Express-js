// const mongoose =require('mongoose')

// const connectDB =()=>{
//   return mongoose.connect('mongodb+srv://jayrajrao15:ram123@cluster0.pjdhf90.mongodb.net/projectpainting?retryWrites=true&w=majority')
//   .then(()=>{
//     console.log('connection succesfully')
//   })
//   .catch((err)=>{
//   console.log(err)
//   })
// }
// mongoose.set('strictQuery', false);
// module.exports=connectDB

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected (local)");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

mongoose.set("strictQuery", false);

module.exports = connectDB;