require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const session = require("express-session");
const flash = require("connect-flash");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");
const connectDB = require("./DB/connectdb");

const app = express();
const port = process.env.PORT;

/* =======================
   DB CONNECTION
======================= */
connectDB();

/* =======================
   SECURITY (FINAL CSP FIX ✅)
======================= */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },

    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://cdn.jsdelivr.net",
          "https://code.jquery.com",
          "https://maxcdn.bootstrapcdn.com",
        ],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
        ],

        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https:",          // 🔥 THIS FIXES HTTP/HTTPS MIX
        ],

        connectSrc: [
          "'self'",
          "https:",
        ],

        fontSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com",
        ],
      },
    },
  })
);



app.disable("x-powered-by");

/* =======================
   VIEW ENGINE
======================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* =======================
   STATIC FILES
======================= */
app.use(express.static(path.join(__dirname, "public")));

/* =======================
   BODY PARSER
======================= */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* =======================
   FILE UPLOAD
======================= */
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

/* =======================
   SESSION
======================= */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 2,
    },
  })
);

/* =======================
   FLASH
======================= */
app.use(flash());

// app.use((req, res, next) => {
//   res.locals.metaTitle = "MyBlog";
//   res.locals.metaDescription =
//     "A modern tech blog built with Node.js and Express";
//   res.locals.metaImage = "";
//   res.locals.shareUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   res.locals.info = req.flash("info");
//   res.locals.user = req.session.user || null;
//   res.locals.admin = req.session.admin || null;
//   next();
// });

/* =======================
   ROUTES
======================= */
app.use("/", require("./routes/frontRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/user", require("./routes/userRoutes"));

/* =======================
   404 HANDLER
======================= */
app.use((req, res) => {
  res.status(404).render("404");
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

/* =======================
   SERVER
======================= */
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
