const express = require("express");
const router = express.Router();
const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const verifyToken = require("../middleware/authJWT");
const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config.js");

/**
 * @route   GET /users/check
 * @desc    Check user password using id
 * @access  Private
 */

router.post("/check", (req, res) => {
  User.findOne({ _id: req.body.id })
    .then((user) => {
      if (!user) {
        console.log('No such user')
        return res.status(200).json({ status: false });
      } else {
        console.log(user.password);
        bcrypt.compare(req.body.password, user.password).then((isMatch) => {
          console.log(isMatch);
          if (isMatch) {
            res.status(200).json(true);
          } else {
            res.status(200).json(false);
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

/**
 * @route   PUT /users/update/account/
 * @desc    Update account data
 * @access  Private
 */

router.put("/update/:id", (req, res) => {
  const hash = bcrypt.hashSync(req.params.id, 10);
  User.updateOne(
    {
      _id: req.body.id,
    },
    { password: hash },
    { upsert: true }
  )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200);
});

/**
 * @route   GET /users
 * @desc    Retrieve all users
 * @access  Private
 */

router.get("/get", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) throw Error("No users exist");
    res.json(users);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
 * @route   GET /users/:id
 * @desc    Retrieve user
 * @access  Private
 */

router.get("/get/:id", (req, res) => {
  User.findById(req.params.id)
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200);
});


/**
 * @route   Post /user/register/
 * @desc    Register user
 * @access  Private
 */

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) throw err;
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            // TODO : isEmailVerified: false   email verfication
          });
          // newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

/**
 * @route   Post /user/login/
 * @desc    login user
 * @access  Private
 */

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (isMatch) {
            // User matched
            // Create JWT Payload
            const payload = {
              id: user._id,
              name: user.name,
              email: user.email,
            };
            //sign token
            jwt.sign(
              payload,
              config.secret,
              {
                expiresIn: 86400, //1 day in seconds
              },
              (err, token) => {
                res.json({
                  success: true,
                  message: "Authentication successful!",
                  token: "Bearer " + token,
                });
              }
            );
          } else {
            return res
              .status(400)
              .json({ incorrect: "Incorrect Username or password" });
          }
        });
      } else {
        return res
          .status(404)
          .json({ incorrect: "Incorrect Username or password" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

module.exports = router;
