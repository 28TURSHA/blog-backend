const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required:true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    required: false,
    default: [],
  },
});

module.exports = mongoose.model("blogs", blogSchema);
