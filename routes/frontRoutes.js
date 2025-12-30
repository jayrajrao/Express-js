const express = require("express");
const router = express.Router();
const FrontController = require("../controllers/FrontController");

router.get("/", FrontController.home);
router.get("/about", FrontController.about);
router.get("/contact", FrontController.contact);
router.post("/contact", FrontController.contactadd);
router.get("/blog", FrontController.blog);
router.get("/blogdetail/:id", FrontController.blogdetail);

router.get("/blog/category/:id", FrontController.blogByCategory);
router.get("/login", FrontController.login);
router.post("/verifylogin", FrontController.verifylogin);
router.get("/register", FrontController.adminregister);
router.post("/admininsert", FrontController.admininsert);




router.post("/blog/:id/comment", FrontController.addComment);
router.post("/blog/:id/like", FrontController.toggleLike);

router.get("/blogdetail/:id", FrontController.blogdetail);
router.post("/blog/:id/comment", FrontController.addComment);
router.post("/blog/:id/like", FrontController.toggleLike);



module.exports = router;
