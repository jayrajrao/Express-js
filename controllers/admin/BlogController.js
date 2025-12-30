const cloudinary = require("cloudinary").v2;
const BlogModel = require("../../Model/blog");
const CategoryModel = require("../../Model/category");
const asyncHandler = require("../../utils/asyncHandler");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class BlogController {

  // ======================
  // DISPLAY ALL BLOGS
  // ======================
static blogdisplay = asyncHandler(async (req, res) => {
  const blogs = await BlogModel.find()
    .populate("category")
    .sort({ createdAt: -1 });

  const categories = await CategoryModel.find({ status: "active" });

  res.render("admin/blog/blogdisplay", {
    blogs,
    categories,   // 👈 NEW
    current: "blogs",
  });
});


  // ======================
  // INSERT BLOG
  // ======================
static bloginsert = asyncHandler(async (req, res) => {

  if (!req.files || !req.files.image) {
    req.flash("error", "Image required");
    return res.redirect("/admin/blogdisplay");
  }

  if (!req.body.category) {
    req.flash("error", "Category required");
    return res.redirect("/admin/blogdisplay");
  }

  const upload = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    { folder: "blog_image" }
  );

  await BlogModel.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,   // 👈 IMPORTANT
    image: {
      public_id: upload.public_id,
      url: upload.secure_url,
    },
  });

  req.flash("success", "Blog added successfully");
  res.redirect("/admin/blogdisplay");
});


  // ======================
  // EDIT BLOG
  // ======================
  static blogedit = asyncHandler(async (req, res) => {
    const blog = await BlogModel.findById(req.params.id);

    if (!blog) {
      req.flash("error", "Blog not found");
      return res.redirect("/admin/blogdisplay");
    }

    res.render("admin/blog/blogedit", {
      blog,
      current: "blogs",   // ✅ sidebar active
    });
  });

  // ======================
  // UPDATE BLOG
  // ======================
  static blogupdate = asyncHandler(async (req, res) => {
    const blog = await BlogModel.findById(req.params.id);

    let updateData = {
      title: req.body.title,
      description: req.body.description,
    };

    if (req.files && req.files.image) {
      if (blog.image?.public_id) {
        await cloudinary.uploader.destroy(blog.image.public_id);
      }

      const upload = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        { folder: "blog_image" }
      );

      updateData.image = {
        public_id: upload.public_id,
        url: upload.secure_url,
      };
    }

    await BlogModel.findByIdAndUpdate(req.params.id, updateData);
    req.flash("success", "Blog updated successfully");
    res.redirect("/admin/blogdisplay");
  });

  // ======================
  // DELETE BLOG
  // ======================
  static blogdelete = asyncHandler(async (req, res) => {
    const blog = await BlogModel.findById(req.params.id);

    if (blog?.image?.public_id) {
      await cloudinary.uploader.destroy(blog.image.public_id);
    }

    await BlogModel.findByIdAndDelete(req.params.id);
    req.flash("success", "Blog deleted successfully");
    res.redirect("/admin/blogdisplay");
  });
}

module.exports = BlogController;
