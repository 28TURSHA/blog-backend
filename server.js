// require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const blogsRouter = require("./routes/blog.routes");
const usersRouter = require("./routes/users.routes");
const commentRouter = require("./routes/comments.routes");

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }, () =>
  console.log("Connected to Database")
);

app.use("/users", usersRouter);
app.use("/blogs", blogsRouter);
app.use("/blogs", commentRouter);

app.listen(process.env.PORT || 5000, () => console.log(" Server started"));
