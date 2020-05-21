const express = require("express");
const router = express.Router();
const User = require("../models/users.model");

/**
 * @route   POST /users/save
 * @desc    Save user
 * @access  Private
 */

router.post("/save", (req, res) => {
  const user = new User(req.body);
  console.log(req.body);
  user
    .save()
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      res.status(400);
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
 * @route   PUT /users/update/:id
 * @desc    Update user
 * @access  Private
 */

router.put("/update/:id", (req, res) => {
  User.updateOne(
    {
      _id: req.params.id,
    },
    req.body,
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

module.exports = router;
