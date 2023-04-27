const express = require("express");
// const bcrypt = require('bcrypt');
// const router = require('./Routes/web')
// var session = require("express-session");
// var FlashMessages = require('flash-messages');
// const express = require('express')
// index.use(bodyParser.json());
const connectDB = require("./DB/connectdb");
const index = express();
const port = 3002;
const bodyParser = require("body-parser");
// const index = express.index
const AdminController = require("./controllers/admin/AdminController");
const BlogController = require("./controllers/admin/BlogController");
const categorymodel = require("./Model/category");
const CategoryController = require("./controllers/admin/CategoryController");
const AboutController = require("./controllers/admin/AboutController");
const { about } = require("./controllers/FrontController");
const FrontController = require("./controllers/FrontController");
const ContactController = require("./controllers/admin/ContactController");

const fileupload = require("express-fileupload");
index.use(fileupload({ useTempFiles: true }));

const cloudinary = require("cloudinary");

//mongoose connections
connectDB();

//setup ejs
index.set("view engine", "ejs");

//static files path
index.use(express.static("Public"));

//body-parser links
index.use(bodyParser.urlencoded({ extended: false }));

// index.use(flash());

//frontend controllers
index.get("/dashboard.html", FrontController.home);
index.get("/", FrontController.home);
index.get("/about", FrontController.about);
index.get("/contact", FrontController.contact);
index.get("/blog", FrontController.blog);
index.get("/login", FrontController.login);
index.get("/blogdetail/:id", FrontController.blogdetail);
index.get("/register", FrontController.adminregister);
index.post("/adminregister", FrontController.admininsert);
index.post('/verify_login',FrontController.verifylogin)
// index.get('/logout',FrontController.logout)

//admin controllers
index.get("/admin/dashboard", AdminController.Dashboard);

//admin blog controllers
index.get("/admin/blogdisplay", BlogController.blogdisplay);
index.post("/bloginsert", BlogController.bloginsert);
index.get("/admin/blogview/:id", BlogController.blogview);
index.get("/admin/blogedit/:id", BlogController.blogedit);
index.post("/blogupdate/:id", BlogController.blogupdate);
index.get("/admin/blogdelete/:id", BlogController.blogdelete);

//category controllers
index.get("/admin/categorydisplay", CategoryController.categorydisplay);

//admin about page
index.get("/admin/about", AboutController.aboutdisplay);
index.get("/admin/aboutedit/:id", AboutController.aboutedit);
index.post("/aboutupdate/:id", AboutController.aboutupdate);

//admin category controller
index.get("/admin/categorydisplay", CategoryController.categorydisplay);
index.post("/categoryinsert", CategoryController.categoryinsert);
index.get("/admin/categoryview/:id", CategoryController.categoryview);
index.get("/admin/categoryedit/:id", CategoryController.categoryedit);
index.post("/categoryupdate/:id", CategoryController.categoryupdate);
index.get("/admin/categorydelete/:id", CategoryController.categorydelete);

//admin contact controller
index.get("/admin/contactdisplay", ContactController.contactview);

//contact page
index.post("/contactinsert", ContactController.contactadd);

const flash = require("connect-flash");

var session = require("express-session");


// return list of messages

index.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);

index.use(flash());

index.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
