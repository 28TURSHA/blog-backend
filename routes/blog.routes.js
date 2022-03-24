const router = require("express").Router();
const Blog = require("../models/blogs");
const verifyToken = require("../middleware/auth.Jwt");
const { getBlog } = require("../middleware/finders");
const { getUser } = require("../middleware/finders");

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
  res.send(res.Blog);
});

// Creating one
router.post("/", [verifyToken, getUser], async (req, res) => {
  const blog = await Blog({
    name: req.body.name,
    description: req.body.description,
    content: req.body.content,
    image: req.body.image,
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
router.patch("/:id", [verifyToken, getBlog], async (req, res) => {
  if (res.blog.created_by != req.userId) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
  if (req.body.name != null) {
    res.blog.name = req.body.name;
  }
  if (req.body.description != null) {
    res.blog.description = req.body.description;
  }
  if (req.body.content != null) {
    res.blog.content = req.body.content;
  }
  if (req.body.image != null) {
    res.blog.image = req.body.image;
  }
  try {
    const updatedBlog = await res.blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", [verifyToken, getBlog], async (req, res) => {
  if (res.blog.created_by != req.userId) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
  try {
    await res.blog.remove();
    res.json({ message: "Deleted blog" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
