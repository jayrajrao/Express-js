const CategoryModel=require('../../Model/category')
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dzdnamaqf",
  api_key: "453969946325322",
  api_secret: "I0XGUftEgyZR_H2FC7MeD8gTSoM",
});

class CategoryController{
    static categorydisplay=async(req,res)=>{
        const categorydata=await CategoryModel.find()
        // console.log(data)
        res.render('admin/category/categorydisplay',{cd:categorydata})
    }
    
    static categoryinsert = async (req,res)=>{
        //console.log(req.files.image)
        const file =req.files.image;
        const myimages =await cloudinary.uploader.upload(file.tempFilePath,{
            folder: "categoryimage"
        });
        //console.log(myimages)
        try{
            const result = new CategoryModel({
                categoryname : req.body.categoryname,
                image: {
                    public_id: myimages.public_id,
                    url: myimages.secure_url,
                },
            });
            await result.save();
            res.redirect("/admin/categorydisplay")
        }
        catch(err){
            console.log(err);

        }
    };
    static categoryview =async(req,res)=>{
        // console.log(req.params.id)          //id get by params
        try{
                const result = await CategoryModel.findById(req.params.id)
                //console.log(result)
                res.render('admin/category/categoryview',{categoryview:result})
        }
        catch (err){
            console.log(err);
        }
    }
    static categoryedit =async(req,res)=>{
        //console.log(req.params.id)
        try {
            const result = await CategoryModel.findById(req.params.id);
            //console.log(result)
            res.render("admin/category/categoryedit", { categoryedit: result });
          } catch (err) {
            console.log(err);
          }
    
    }
    static categoryupdate = async(req,res)=>{
        try{
                const result = await CategoryModel.findByIdAndUpdate(req.params.id, {
                categoryname: req.body.categoryname,
            })
            await result.save();
            res.redirect("/admin/categorydisplay");
        }
        catch(err){
            console.log(err)
        }
    }
    static categorydelete = async (req,res)=>{
        try{
              const result = await CategoryModel.findByIdAndDelete(req.params.id)
              res.redirect("/admin/categorydisplay");
        }
        catch(err){
          console.log(err)
        }
      }
}
module.exports=CategoryController
