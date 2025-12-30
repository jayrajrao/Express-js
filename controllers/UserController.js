const bcrypt = require("bcrypt");
const UserModel = require("../Model/user");

class UserController {

  // ======================
  // USER REGISTER
  // ======================
  static register = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.redirect("/user/register");
      }

      const exists = await UserModel.findOne({ email });
      if (exists) {
        return res.redirect("/user/register");
      }

      const hash = await bcrypt.hash(password, 10);

      await UserModel.create({
        name,
        email,
        password: hash,
        role: "user"
      });

      res.redirect("/user/login");
    } catch (error) {
      console.log(error);
      res.redirect("/user/register");
    }
  };

  // ======================
  // USER LOGIN
  // ======================
  static login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.redirect("/user/login");
      }

      // ✅ FIX: Model and variable are different
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.redirect("/user/login");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.redirect("/user/login");
      }

      // set session
      req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.redirect("/user/login");
    }
  };

  // ======================
  // USER LOGOUT
  // ======================
  static logout = (req, res) => {
    req.session.user = null;
    res.redirect("/");
  };
}

module.exports = UserController;
