const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/register", (req, res) => res.render("user/register"));
router.post("/register", UserController.register);

router.get("/login", (req, res) => res.render("user/login"));
router.post("/login", UserController.login);

router.get("/logout", UserController.logout);

module.exports = router;
