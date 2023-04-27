const mongoose =require('mongoose')

const connectDB =()=>{
  return mongoose.connect('mongodb+srv://jayrajrao15:ram123@cluster0.pjdhf90.mongodb.net/projectpainting?retryWrites=true&w=majority')
  .then(()=>{
    console.log('connection succesfully')
  })
  .catch((err)=>{
  console.log(err)
  })
}
mongoose.set('strictQuery', false);
module.exports=connectDB