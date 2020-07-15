const express = require("express");
const router = express.Router(); 
const Unit = require("../models/unit.model");

/**
 * @route   GET /tips/getPlantTypes
 * @desc    Retrieve all plant types related to a user
 * @access  Private
 */

router.get("/get/:id", async (req, res) => {
  var plants = [];

  Unit.find({ userID: req.params.id })
    .then((docs) => {
      for (var a in docs) {
        console.log(docs[a].plantType);
        plants.push(docs[a].plantType)
      }
      res.send(plants)
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200);
});

module.exports = router;
