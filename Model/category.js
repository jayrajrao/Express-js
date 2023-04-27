const mongoose = require("mongoose");

// define schema
const CategorySchema = new mongoose.Schema(
  {
    categoryname: {
      type: String,
      required: true,
    },
    image:
    {
      public_id: {
        type: String,

      },
      url: {
        type: String,

      },
    },
  },
  { timestamps: true }
);

// create collection
const CategoryModel = mongoose.model("category", CategorySchema);
//                                     ^ collection name

module.exports = CategoryModel;
