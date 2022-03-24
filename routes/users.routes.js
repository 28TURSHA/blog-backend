const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth.Jwt");
const nodemailer = require("nodemailer");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//SIGNUP
router.post(
  "/signup",
  [checkDuplicateName, checkDuplicateEmail],
  async (req, res) => {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      const newUser = await user.save();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "turshaarendse@gmail.com",
          pass: "Tursha2021",
        },
      });

      const mailOptions = {
        from: "turshaarendse@gmail.com",
        to: req.body.email,
        subject: `Sign-up Successful`,
        text: `thank you, ${req.body.username} your sign-up was successful`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.status(201).json(newUser);
      console.log(salt);
      console.log(hashedPassword);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);
//SIGNIN
router.post("/signin", async (req, res) => {
  try {
    User.findOne({ username: req.body.username }, (err, person) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!person) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        person.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      let token = jwt.sign(
        { _id: person._id, createBlog: person.createBlog },
        process.env.ACCESSTOKEN,
        {
          expiresIn: 86400, // 24 hours
        }
      );
      res.status(200).send({
        _id: person._id,
        username: person.username,
        email: person.email,
        accessToken: token,
      });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//PATCH
router.patch("/:id", [getUser, verifyToken], async (req, res) => {
  if (req.body.username) {
    res.user.username = req.body.username;
  }
  if (req.body.email) {
    res.user.email = req.body.email;
  }
  if (req.body.password) {
    res.user.password = req.body.password;
  }
  if (req.body.createBlog) {
    res.user.createBlog = req.body.createBlog;
  }
  try {
    const updatedUser = await res.user.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: res.user.email,
      subject: `Update Successful`,
      text: `${res.user.username}, your profile was successfuly updated!`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", [getUser, verifyToken], async (req, res) => {
  try {
    if (req.params.id != req.userId) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    await res.user.remove();
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find User" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}
async function checkDuplicateName(req, res, next) {
  let user;
  try {
    user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(404).send({ message: "User already exist." });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}

async function checkDuplicateEmail(req, res, next) {
  let email;
  try {
    email = await User.findOne({ email: req.body.email });
    if (email) {
      return res.status(404).send({ message: "Email already exist." });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}
module.exports = router;
