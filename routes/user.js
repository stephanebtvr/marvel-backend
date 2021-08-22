const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//const modelUser = require("../Models/User");
const User = require("../Models/User");
//route SIGNUP:
router.post("/signup", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    if (user) {
      res
        .status(400)
        .json({ message: "This email has already been used in our database" });
    } else if (req.fields.username) {
      const password = req.fields.password;
      const salt = uid2(16);
      const hash = SHA256(password + salt).toString(encBase64);
      const token = uid2(16);
      const newUser = await new User({
        email: req.fields.email,
        account: {
          username: req.fields.username,
        },
        token: token,
        hash: hash,
        salt: salt,
      });
      await newUser.save();
      res.status(200).json({
        token: token,
        account: {
          username: req.fields.username,
          phone: req.fields.phone,
        },
      });
    } else {
      res.status(400).json({ message: "Error: username is not defined" });
    }
  } catch (error) {
    res.status(400).json({ message: message.error });
  }
});
//route LOGIN:
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    if (user) {
      const password = req.fields.password;
      const salt = user.salt;
      const hash = SHA256(password + salt).toString(encBase64);
      // const token = uid2(16);
      if (user.hash === hash) {
        res.status(200).json({
          token: user.token,
          account: {
            username: user.account.username,
          },
        });
      } else {
        res.status(400).json({ message: "Wrong password, please try again" });
      }
    } else {
      res.status(400).json({ message: "This email is unknown, please signup" });
    }
  } catch (error) {
    res.status(400).json({ message: message.error });
  }
});

module.exports = router;
