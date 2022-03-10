const express = require("express");
const router = express.Router();
const Blog = require("../models/blogs");
const verifyToken = require("../middleware/auth.Jwt");
const getBlog = require("../middleware/finders");
// Getting all
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Getting One
router.get("/:id", getBlog, (req, res) => {
  res.send(res.blog);
});
// Creating one
router.post("/", verifyToken, async (req, res) => {
  const blog = await Blog({
    name: req.body.name,
    description: req.body.description,
    created_by: req.userId,
  });

  try {
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Updating One
router.patch("/:id", [getBlog, verifyToken], async (req, res) => {
  if (res.product.created_by != req.userId) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }
  if (req.body.description != null) {
    res.product.description = req.body.description;
  }
  try {
    const updatedBlog = await res.blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Deleting One
router.delete("/:id", [getBlog, verifyToken], async (req, res) => {
  try {
    if (res.blog.created_by != req.userId) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    await res.blog.remove();
    res.json({ message: "Deleted product" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
