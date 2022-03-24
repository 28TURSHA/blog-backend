const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  res.send("Contact");
});

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: "turshaarendse@gmail.com",
    subject: `${name} wants to contact you`,
    text: `
        ${message} 

        contact them at ${email}
        `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
    try {
      res.json({ msg: `Thank you ${name}, your message was sent` });
    } catch (err) {
      res.status(500).json({ msg: err.msg });
    }
  });
});

module.exports = router;
