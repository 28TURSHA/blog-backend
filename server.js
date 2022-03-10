require("dotenv").config();

const express = require("express");
const cors = require("cors")
const app = express();
const mongoose = require("mongoose");
const blogsRouter = require("./routes/blog.routes");
const usersRouter = require("./routes/users.routes");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));
app.use(cors())
app.use(express.json());
app.use("/blogs", blogsRouter);
app.use("/users", usersRouter);
app.listen(process.env.PORT || 5000, () => console.log(" Server started"));
