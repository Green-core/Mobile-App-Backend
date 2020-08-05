const express = require("express");
const router = express.Router();
const Unit = require("../models/unit.model");
const Tips = require("../models/tips.model"); 

/**
 * @route   GET /tips/get/userId
 * @desc    Retrieve all plant types and id's of them related to a user
 * @access  Private
 */ 

router.get("/get/:id", async (req, res) => {
  var plants = [];
  Unit.find({ userID: req.params.id })
    .then((docs) => {
      for (var a in docs) {
        if (docs[a].plantType != "Other" && docs[a].plantType != "") {
          plants.push( docs[a].plantType );
        }
      }
    })
    .then(() => {
      console.log(JSON.stringify(plants, null, 2));
      res.send(plants).status(200);
    });
});

/**
 * @route   GET /tips/plant/plantId
 * @desc    Retrieve all tips related to a plant
 * @access  Private
 */

router.get("/get/plant/:id", async (req, res) => {
  Tips.find({ type:  req.params.id  }).then((doc) => {
    console.log(JSON.stringify(doc, null, 2));
    res.send(doc).status(200);
  });
});

   

module.exports = router;
