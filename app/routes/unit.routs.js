const express = require("express");
const router = express.Router();
const Unit = require("../models/unit.model");
const ObjectId = require('mongoose').Types.ObjectId; 

/**
 * @route   GET /units/check/:id
 * @desc    Check unit existance
 * @access  Private
 */

router.get("/check/:id", (req, res) => {
  Unit.findById(req.params.id)
    .then((doc) => {
      if (doc) {
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200);
});

/**
 * @route   PUT /units/update/:id
 * @desc    Update unit data
 * @access  Private
 */

router.put("/update/:id", (req, res) => {
  Unit.updateOne(
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

/**
 * @route   DELETE /units/delete/:id
 * @desc    Delete unit data
 * @access  Private
 */


router.delete("/delete/:id", (req, res) => {
  Unit.deleteOne(
    {
      _id: req.params.id,
    }, 
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
 * @route   GET /units/get/:id
 * @desc    Get all units  related to one user data
 * @access  Private
 */


router.get("/get/:id", (req, res) => {
  Unit.find({userID: new ObjectId(req.params.id)})
    .then((result) => {
      console.log(req.params.id)
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200);
});
 

module.exports = router;
