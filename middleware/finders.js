const Blog = require("../models/blogs");

getBlog = async (req, res, next) => {
  let blog;
  try {
    blog = await blog.findById(req.params.id);
    if (blog == null) {
      return res.status(404).json({ message: "blog" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.blog = product;
  next();
};

module.exports = getBlog;
