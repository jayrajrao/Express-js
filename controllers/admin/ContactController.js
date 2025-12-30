const ContactModel = require("../../Model/contact");
const asyncHandler = require("../../utils/asyncHandler");

class ContactController {

  // ======================
  // VIEW CONTACT MESSAGES (ADMIN)
  // ======================
  static contactview = asyncHandler(async (req, res) => {
    const contactdata = await ContactModel.find();
    res.render("admin/contact/contactdisplay", { cd: contactdata,
      current: "contact",
     });
  });

  // ======================
  // ADD CONTACT (FRONT)
  // ======================
  static contactadd = asyncHandler(async (req, res) => {
    const { name, email, phone, message } = req.body;

    await ContactModel.create({
      name,
      email,
      phone,
      message,
    });

    req.flash("success", "Message sent successfully");
    res.redirect("/contact");
  });
}

module.exports = ContactController;
