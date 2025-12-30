const BlogModel = require("../Model/blog");
const AboutModel = require("../Model/about");
const ContactModel = require("../Model/contact");
const AdminModel = require("../Model/admin");
const bcrypt = require("bcrypt");
const asyncHandler = require("../utils/asyncHandler");
const CategoryModel = require("../Model/category")
class FrontController {
  // ======================
  // HOME
  // ======================
  static home = asyncHandler(async (req, res) => {
    const recentblog = await BlogModel.find().sort({ createdAt: -1 }).limit(6);

    const categories = await CategoryModel.find({ status: "active" });
    res.render("home", {
      d: recentblog,
      categories
    });
  });

  // ======================
  // ABOUT
  // ======================
   static about = async (req, res) => {
    const about = await AboutModel.findOne(); // 👈 VERY IMPORTANT
    res.render("about", { about });          // 👈 about pass kiya
  };

  // ======================
  // CONTACT PAGE
  // ======================
  static contact = (req, res) => {
    res.render("contact");
  };

  // ======================
  // BLOG LIST
  // ======================
  static blog = asyncHandler(async (req, res) => {
    const blogs = await BlogModel.find().sort({ createdAt: -1 });
    res.render("blog", { d: blogs });
  });

  // ======================
  // BLOG DETAIL
  // ======================
  static blogdetail = asyncHandler(async (req, res) => {
    const blog = await BlogModel.findById(req.params.id).populate(
      "comments.user",
      "name"
    );

    if (!blog) {
      return res.status(404).render("404");
    }

    const recentblog = await BlogModel.find().sort({ createdAt: -1 }).limit(5);

    // Like state
    let isLiked = false;
    if (req.session.user) {
      isLiked = blog.likes.includes(req.session.user.id);
    }

    // Reading time
    const wordCount = blog.description.split(" ").length;
    const readingTime = Math.ceil(wordCount / 200);

    // 🔥 SHARE URL (FIX)
    const shareUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    res.render("blogdetail", {
      r: blog,
      recentblog,
      user: req.session.user || null,
      isLiked,
      readingTime,
      shareUrl,

      // 🔥 SEO DATA
      metaTitle: blog.title + " | MyBlog",
      metaDescription: blog.description.substring(0, 150),
      metaImage: blog.image.url,
    });
  });

  static addComment = asyncHandler(async (req, res) => {
    if (!req.session.user) {
      req.flash("error", "Please login to comment");
      return res.redirect("/login");
    }

    const { comment } = req.body;

    await BlogModel.findByIdAndUpdate(req.params.id, {
      $push: {
        comments: {
          user: req.session.user.id,
          text: comment,
        },
      },
    });

    res.redirect("/blogdetail/" + req.params.id);
  });

  static toggleLike = asyncHandler(async (req, res) => {
    if (!req.session.user) {
      req.flash("error", "Please login to like a blog");
      return res.redirect("/login");
    }

    const blog = await BlogModel.findById(req.params.id);
    const userId = req.session.user.id;

    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.redirect("/blogdetail/" + req.params.id);
  });


  static blogByCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;

      const blogs = await BlogModel.find({
        category: categoryId,
      })
        .populate("category")
        .sort({ createdAt: -1 });

      const categories = await CategoryModel.find({
        status: "active",
      });

      res.render("blog-by-category", {
        blogs,
        categories,
      });

    } catch (error) {
      console.error(error);
      res.redirect("/");
    }
  };
  // ======================
  // LOGIN PAGE
  // ======================
  static login = (req, res) => {
    res.render("login");
  };

  // ======================
  // VERIFY LOGIN (ADMIN)
  // ======================
  static verifylogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash("error", "All fields are required");
      return res.redirect("/login");
    }

    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/login");
    }

    const isMatched = await bcrypt.compare(password, admin.password);
    if (!isMatched) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/login");
    }

    req.session.admin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    };

    req.flash("success", "Login successful");
    res.redirect("/admin/dashboard");
  });

  // ======================
  // ADMIN REGISTER PAGE
  // ======================
  static adminregister = (req, res) => {
    res.render("register");
  };

  // ======================
  // ADMIN INSERT
  // ======================
  static admininsert = asyncHandler(async (req, res) => {
    const { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
      req.flash("error", "All fields are required");
      return res.redirect("/register");
    }

    if (password !== cpassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/register");
    }

    const exists = await AdminModel.findOne({ email });
    if (exists) {
      req.flash("error", "Email already exists");
      return res.redirect("/register");
    }

    const hash = await bcrypt.hash(password, 10);
    await AdminModel.create({ name, email, password: hash });

    req.flash("success", "Registration successful. Please login.");
    res.redirect("/login");
  });

  // ======================
  // CONTACT SUBMIT (FRONT)
  // ======================
  static contactadd = asyncHandler(async (req, res) => {
    const { name, email, phone, message } = req.body;
    await ContactModel.create({ name, email, phone, message });
    req.flash("success", "Message sent successfully");
    res.redirect("/contact");
  });
}

module.exports = FrontController;
