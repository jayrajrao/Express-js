const AboutModel = require("../../Model/about");
const asyncHandler = require("../../utils/asyncHandler");

class AboutController {

  // ======================
  // DISPLAY ABOUT DATA
  // ======================
  static aboutdisplay = asyncHandler(async (req, res) => {
    const aboutdata = await AboutModel.find();
    res.render("admin/about/aboutus", { ac: aboutdata , current: "about"});
  });

  // ======================
  // EDIT ABOUT
  // ======================
  static aboutedit = asyncHandler(async (req, res) => {
    const result = await AboutModel.findById(req.params.id);
    res.render("admin/about/aboutedit", { aboutedit: result ,current: "about"});
  });

  // ======================
  // UPDATE ABOUT
  // ======================
  static aboutupdate = asyncHandler(async (req, res) => {
    await AboutModel.findByIdAndUpdate(req.params.id, {
      description: req.body.description,
    });

    res.redirect("/admin/aboutus");
  });
}

module.exports = AboutController;
