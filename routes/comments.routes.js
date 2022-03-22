const router = require("express").Router();
const Comment = require("../models/comment");
const { getBlog } = require("../middleware/finders");
const { getUser } = require("../middleware/finders");
const verifyToken = require("../middleware/auth.Jwt");

//Get all comments
// router.get("/:id/comments", [verifyToken, getBlog], (req, res) => {
//   res.send(res.blog.comments);
// });
router.get("/:id/comments", [verifyToken, getBlog], (req, res) => {
  return res.send(res.post.comments);
});

//Create a new comment
// router.put(
//   "/:id/comments",
//   [verifyToken, getBlog, getUser],
//   async (req, res) => {
//     let createComment = new Comment({
//       comment: req.body.comment,
//       created_by: req.userId,
//     });
//     console.log(createComment);
//     let commentArr = res.blog.comments;
//     let createdComments = false;
//     if (!createdComments) commentArr.push(createComment);
//     try {
//       await res.blog.save(commentArr);
//       res.status(200).send({ message: "Created new comment" });
//     } catch (err) {
//       res.status(500).send({ message: err.message });
//     }
//   }
// );
router.post(
  "/:id/comments/create",
  [verifyToken, getBlog, getUser],
  async (req, res) => {
    let userName = res.user.username;
    let userID = res.user._id;
    let newComment = new Comment({
      comment: req.body.comment,
      created_by: userName,
      userId: userID,
    });
    let comments = res.post.comments;
    let addedToComments = false;
    if (!addedToComments) comments.push(newComment);
    try {
      const updatedPost = res.post.save(comments);
      res.status(200).send({ message: "Comment created" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);
module.exports = router;
