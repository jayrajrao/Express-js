const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/admin/AdminController");
const BlogController = require("../controllers/admin/BlogController");
const CategoryController = require("../controllers/admin/CategoryController");
const AboutController = require("../controllers/admin/AboutController");
const ContactController = require("../controllers/admin/ContactController");
const isAdminAuthenticated = require("../middlewares/auth");

/* ======================
   ADMIN DASHBOARD
====================== */
router.get("/dashboard", isAdminAuthenticated, AdminController.Dashboard);

/* ======================
   BLOG ROUTES
====================== */
router.get("/blogdisplay", isAdminAuthenticated, BlogController.blogdisplay);
router.post("/bloginsert", isAdminAuthenticated, BlogController.bloginsert);
router.get("/blogedit/:id", isAdminAuthenticated, BlogController.blogedit);
router.post("/blogupdate/:id", isAdminAuthenticated, BlogController.blogupdate);
router.get("/blogdelete/:id", isAdminAuthenticated, BlogController.blogdelete);

/* ======================
   CATEGORY ROUTES
====================== */
router.get(
  "/categorydisplay",
  isAdminAuthenticated,
  CategoryController.categorydisplay
);

router.get(
  "/categoryview/:id",
  isAdminAuthenticated,
  CategoryController.categoryview
);
router.post(
  "/categoryinsert",
  isAdminAuthenticated,
  CategoryController.categoryinsert
);

router.get(
  "/categoryedit/:id",
  isAdminAuthenticated,
  CategoryController.categoryedit
);

router.post(
  "/categoryupdate/:id",
  isAdminAuthenticated,
  CategoryController.categoryupdate
);

router.get(
  "/categorydelete/:id",
  isAdminAuthenticated,
  CategoryController.categorydelete
);


/* ======================
   ABOUT ROUTES
====================== */
router.get("/aboutus", isAdminAuthenticated, AboutController.aboutdisplay);
router.get("/aboutedit/:id", isAdminAuthenticated, AboutController.aboutedit);
router.post("/aboutupdate/:id", isAdminAuthenticated, AboutController.aboutupdate);

/* ======================
   CONTACT ROUTES
====================== */
router.get("/contactview", isAdminAuthenticated, ContactController.contactview);

/* ======================
   LOGOUT (FIXED)
====================== */
router.get("/logout", isAdminAuthenticated, (req, res) => {
  // ✅ flash BEFORE destroy
  req.flash("info", "Logged out successfully");

  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
