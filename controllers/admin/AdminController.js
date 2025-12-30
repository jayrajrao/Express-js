const BlogModel = require("../../Model/blog");
const CategoryModel = require("../../Model/category");
const UserModel = require("../../Model/user");
const asyncHandler = require("../../utils/asyncHandler");

class AdminController {
  static Dashboard = asyncHandler(async (req, res) => {

    const blogCount = await BlogModel.countDocuments();
    const categoryCount = await CategoryModel.countDocuments({ status: "active" });
    const userCount = await UserModel.countDocuments();

    // 🔥 Pending comments count (embedded)
    const pendingCommentsAgg = await BlogModel.aggregate([
      { $unwind: "$comments" },
      { $match: { "comments.status": "pending" } },
      { $count: "total" }
    ]);

    const pendingComments = pendingCommentsAgg[0]?.total || 0;

    res.render("admin/dashboard", {
      admin: req.session.admin,
      blogCount,
      categoryCount,
      pendingComments,
      userCount,
       current: "dashboard",
    });
  });
}

module.exports = AdminController;
