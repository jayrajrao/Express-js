
const categorymodel = require("../Model/category")
const AdminModel = require("../Model/admin");
const AboutModel = require("../Model/about");
const BlogModel = require("../Model/blog")
const bcrypt = require("bcrypt");
class FrontController {
  static home = async(req, res) => {
    const data = await BlogModel.find().sort({_id:-1}).limit(6)
    //res.send('helo about')
    //console.log(data)
    res.render("home", {d:data});
  };
  static about = async(req, res) => {
    const aboutdata =await AboutModel.find()
    //res.send('helo about')
    res.render("about", {ab:aboutdata});
  };
  static contact = (req, res) => {
    //res.send('helo about')
    res.render("contact");
  };

  static blog = async(req, res) => {
    const data =  await BlogModel.find()
    // const bloglist = await BlogModel.find();
    res.render("blog", { d: data });
  };
  static login = (req, res) => {
    res.render("login");
  };
  static verifylogin = async (req, res) => {
    try {
      //console.log(req.body)
      const { email, password } = req.body;
      if (email && password) {
        const admin = await AdminModel.findOne({ email: email });
        if (admin != null) {
          const ismatched = await bcrypt.compare(password, admin.password);
          if (admin.email == email && ismatched) {
           //webtoken Generate 
            // const token = jwt.sign({ id: user._id }, 'jayrajrao8269');
            //console.log(token)
           
            res.redirect("/home");
          } else {
            // req.flash("error", "email or password not match");
            res.redirect("/login");
          }
        } else {
          // req.flash("error", "You are not registerd user");
          res.redirect("/login");
        }
      } else {
        // req.flash("error", "All Field are required");
        res.redirect("/login");
      }
    } catch (error) {}
  };
  static adminregister = async (req, res) => {
    res.render("register");
  };
  static admininsert = async (req, res) => {
    try {
      //console.log(req.body)
       const { name, email, password, cpassword } = req.body;
       const admin = await AdminModel.findOne({ email: email });
      //console.log(admin)
      if (admin) {
        // req.flash("error", "email already exists");
        res.redirect("/register");
      } else {
        if (name && email && password && cpassword) {
          if (password == cpassword) {
            try {
              const hashpassword = await bcrypt.hash(password,10)
              const result = new AdminModel({
                name: name,
                email: email,
                password: hashpassword,
              });
              await result.save();
              // req.flash("success", "registration sucessuful  Please login ");
              res.redirect("/login");
            } catch (err) {
              console.log(err);
            }
          } else {
            // req.flash("error", "Password and confirm password doesnot match");
            res.redirect("/register");
          }
        }
       }

    } catch (err) {
      console.log(err);
      }
  }
  

  static blogdetail= async(req,res)=>{
    try {
      const category = await categorymodel.find()
      const recentblog = await BlogModel.find()
      const result = await BlogModel.findById(req.params.id)
      //console.log(result)
      res.render("blogdetail", {r:result, recentblog:recentblog, cat:category})
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = FrontController;
