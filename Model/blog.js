const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "category",
  required: true
},
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
      },
    },

    /* ================== LIKES ================== */
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    /* ================= COMMENTS ================= */
comments: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    text: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],
  },
  { timestamps: true }
);

const BlogModel = mongoose.model("blog", blogSchema);
module.exports = BlogModel;
