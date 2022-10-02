require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //for securing passwords
const jwt = require("jsonwebtoken"); //to send the token
const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  //create user only if it is not present
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1)
        return res.status(409).json({ message: "Email already exists" });
      else {
        //secure password
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) return res.status(500).json({ error: err });
          else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User Created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
  
};

exports.user_login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      console.log(user);
      if (!user)
        return res.status(401).json({
          message: "Auth failed",
        });
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err)
          return res.status(401).json({
            message: "Auth failed",
          });
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.user_delete_user = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
