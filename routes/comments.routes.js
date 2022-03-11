const router = require("express").Router();
const Comment = require("../models/comment");
const { getBlog } = require("../middleware/finders");
const { getUser } = require("../middleware/finders");
const verifyToken = require("../middleware/auth.Jwt");

//Get all comments
router.get("/:id/comments", [verifyToken, getBlog], (req, res) => {
  res.send(res.blog.comments);
});

//Create a new comment
router.post("/:id/comments",[verifyToken, getBlog, getUser],
  async (req, res) => {
    let createComment = new Comment
    ({
      comment: req.body.comment,
      created_by: req.userId,
    });
    
    let commentArr = res.blog.comments;
    let createdComments = false;
    if (!createdComments) commentArr.push(createComment);
    try {
      await res.blog.save(commentArr);
      res.status(200).send({ message: "Created new comment" });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

module.exports = router;
