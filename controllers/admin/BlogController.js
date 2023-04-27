var cloudinary = require("cloudinary").v2;
const { findById } = require("../../Model/blog");
const BlogModel = require("../../Model/blog");
//const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dzdnamaqf",
  api_key: "453969946325322",
  api_secret: "I0XGUftEgyZR_H2FC7MeD8gTSoM",
});
class BlogController {
  static blogdisplay = async (req, res) => {
    const data = await BlogModel.find();
    //console.log(data);
    //res.send('hello')
    res.render("admin/blog/blogdisplay", { d: data });
  };
  static bloginsert = async (req, res) => {
    //console.log('hellooo')
    //console.log(req.body)
    //console.log(imagefile)
    const file = req.files.image;
    const myimage = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "blog_image",
    });
    // console.log(myimage)
    try {
      const result = new BlogModel({
        title: req.body.title,
        description: req.body.description,
        image: {
          public_id: myimage.public_id,
          url: myimage.secure_url,
        },
      });
      await result.save();
      //route url(app.js) in redirect
      res.redirect("/admin/blogdisplay");
    } catch (err) {
      console.log(err);
    }
  };

  static blogview = async (req, res) => {
    //console.log(req.params.id)
    try {
      const result = await BlogModel.findById(req.params.id);
      //console.log(result)
      res.render("admin/blog/blogview", { blogview: result });
    } catch (err) {
      console.log(err);
    }
  };
  static blogedit = async (req, res) => {
    //console.log(req.params.id)
    //res.render("admin/blog/blogedit", { blogedit: result });
    try {
      const result = await BlogModel.findById(req.params.id);
      res.render("admin/blog/blogedit", { blogedit: result });
    } catch (err) {
      console.log(err);
    }
  };
  // static blogupdate = async (req, res) => {
  //   //console.log(req.params.id)
  //   //res.render("admin/blog/blogedit", { blogdata: result });
  //   try {
  //     //  console.log(req.params.id)

      static blogupdate = async (req, res) => {
        // console.log(req.params.id)  //id get by params
    
        try {
          if (req.files) {
            const blogdata = await BlogModel.findById(req.params.id);
            //console.log(blogdata)
            const imageid = blogdata.image.public_id;
            console.log(imageid);
            await cloudinary.uploader.destroy(imageid);
    
            //below code for update the image
            const imagefile = req.files.image;
            //console.log(imagefile)
            const myCloud = await cloudinary.uploader.upload(
              imagefile.tempFilePath,
              {
                folder: "blogimage",
                //width:400,
              }
            );
         var   imgdata = {
              title: req.body.title,
              description: req.body.description,
              image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
              },
            };
          } else {
         var   imgdata = {
                title: req.body.title,
                description: req.body.description,
                
              };
          }
    
          //console.log(req.params.id)
          //console.log(req.body)
    
          // below are for previous image delete when update
    
          const result = await BlogModel.findByIdAndUpdate(req.params.id,imgdata);
          await result.save();
          //route url(app.js) in redirect
          res.redirect("/admin/blogdisplay");
        } catch (err) {
          console.log(err);
        }
      };



      //  console.log(req.body)
      
      //below code is for deleteimage
  //     const data = await BlogModel.findById(req.params.id);
  //     //console.log(blogdata)
  //     const imageid = data.image.public_id;
  //     //console.log(imageid)
  //     await cloudinary.uploader.destroy(imageid)

  //     const file = req.files.image;
  //     const myimage = await cloudinary.uploader.upload(file.tempFilePath, {
  //       folder: "blog_image",
  //     });

  //     const result = await BlogModel.findByIdAndUpdate(req.params.id, {
  //       title: req.body.title,
  //       description: req.body.description,
  //       image: {
  //         public_id: myimage.public_id,
  //         url: myimage.secure_url,
  //       },
  //     });
  //     await result.save();
  //     res.redirect("/admin/blogdisplay");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

 
  static blogdelete = async (req, res) => {
    //console.log(req.params.id)
    //res.render('admin/blog/blogedit', {blogedit:result})
    try {
      const data = await BlogModel.findById(req.params.id)
      // res.redirect("/admin/blogdisplay");
      const imageid = data.image.public_id
      //console.log(imageid)
      await cloudinary.uploader.destroy(imageid)

      const result = await BlogModel.findByIdAndDelete(req.params.id)
      res.redirect("/admin/blogdisplay")
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = BlogController;
