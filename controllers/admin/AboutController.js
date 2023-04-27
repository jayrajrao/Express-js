const AboutModel = require("../../Model/about");
class AboutController {
  static aboutdisplay = async (req, res) => {
    const aboutdata = await AboutModel.find();
    console.log(aboutdata);
    res.render("admin/about/aboutus", { ac: aboutdata });
  };
  static aboutedit = async (req, res) => {
    // console.log(req.params.id)
    try {
      const result = await AboutModel.findById(req.params.id);
      //console.log(result)
      res.render("admin/about/aboutedit", { aboutedit: result });
    } catch (err) {
      console.log(err);
    }
  };
  static aboutupdate = async (req, res) => {
    try {
      // console.log(req.params.id)
      // console.log(req.body)

      const result = await AboutModel.findByIdAndUpdate(req.params.id, {
        description: req.body.description,
      });
      await result.save();
      res.redirect("/admin/aboutus");
    } catch (err) {
      console.log(err);
    }
  };
}
module.exports = AboutController;
