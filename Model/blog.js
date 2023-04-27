const mongoose = require("mongoose");
//define schema
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
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
      },
    },
  },
  { timestamps: true }
);
//create collection
const BlogModel = mongoose.model("blog", blogSchema);
module.exports = BlogModel;
