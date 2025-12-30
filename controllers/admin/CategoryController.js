const cloudinary = require("cloudinary").v2;
const CategoryModel = require("../../Model/category");
const asyncHandler = require("../../utils/asyncHandler");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CategoryController {

  // ======================
  // DISPLAY ALL CATEGORIES
  // ======================
static categorydisplay = asyncHandler(async (req, res) => {
  const categorydata = await CategoryModel.find({ status: "active" });

  res.render("admin/category/categorydisplay", {
    cd: categorydata,
    current: "category",   // ✅ ADD THIS
  });
});

  // ======================
  // INSERT CATEGORY
  // ======================
static categoryinsert = asyncHandler(async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    if (!req.body.categoryname) {
      req.flash("error", "Category name is required");
      return res.redirect("/admin/categorydisplay");
    }

    let imageData = {};

    // ✅ image upload (optional safe)
    if (req.files && req.files.image) {
      const file = req.files.image;

      const uploadResult = await cloudinary.uploader.upload(
        file.tempFilePath,
        {
          folder: "categoryimage",
        }
      );

      imageData = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    const category = await CategoryModel.create({
      categoryname: req.body.categoryname,
      image: imageData,
    });

    console.log("CATEGORY CREATED:", category._id);

    req.flash("success", "Category added successfully");
    res.redirect("/admin/categorydisplay");

  } catch (error) {
    console.error("CATEGORY INSERT ERROR:", error.message);

    req.flash("error", error.message);
    res.redirect("/admin/categorydisplay");
  }
});

  // ======================
  // VIEW CATEGORY
  // ======================
// ======================
// VIEW CATEGORY
// ======================
static categoryview = asyncHandler(async (req, res) => {
  const category = await CategoryModel.findById(req.params.id);

  if (!category) {
    req.flash("error", "Category not found");
    return res.redirect("/admin/categorydisplay");
  }

  res.render("admin/category/categoryview", {
    category,
    current: "category",
  });
});

// ======================
// EDIT CATEGORY
// ======================
static categoryedit = asyncHandler(async (req, res) => {
  const result = await CategoryModel.findById(req.params.id);

  if (!result) {
    req.flash("error", "Category not found");
    return res.redirect("/admin/categorydisplay");
  }

  res.render("admin/category/categoryedit", {
    categoryedit: result,
    current: "category",
  });
});


  // ======================
  // UPDATE CATEGORY
  // ======================
static categoryupdate = asyncHandler(async (req, res) => {
  const category = await CategoryModel.findById(req.params.id);

  if (!category) {
    req.flash("error", "Category not found");
    return res.redirect("/admin/categorydisplay");
  }

  let imageData = category.image;

  // ✅ image update if new image uploaded
  if (req.files && req.files.image) {
    // delete old image
    if (imageData?.public_id) {
      await cloudinary.uploader.destroy(imageData.public_id);
    }

    const upload = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        folder: "categoryimage",
      }
    );

    imageData = {
      public_id: upload.public_id,
      url: upload.secure_url,
    };
  }

  await CategoryModel.findByIdAndUpdate(req.params.id, {
    categoryname: req.body.categoryname,
    image: imageData,
  });

  req.flash("success", "Category updated successfully");
  res.redirect("/admin/categorydisplay");
});

  // ======================
  // DELETE CATEGORY
  // ======================
 static categorydelete = asyncHandler(async (req, res) => {
  await CategoryModel.findByIdAndUpdate(req.params.id, {
    status: "inactive"
  });
  res.redirect("/admin/categorydisplay");
});
}

module.exports = CategoryController;
