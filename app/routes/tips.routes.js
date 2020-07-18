const express = require("express");
const router = express.Router();
const Unit = require("../models/unit.model");
const Tips = require("../models/tips.model");

/**
 * @route   GET /tips/getPlantTypes
 * @desc    Retrieve all plant types related to a user
 * @access  Private
 */

router.get("/get/:id", async (req, res) => {
  var plants = [];
  // var tips = [];
  Unit.find({ userID: req.params.id })
    .then((docs) => {
      for (var a in docs) {
        if (docs[a].plantType != "Other" && docs[a].plantType != "") {
          plants.push(docs[a].plantType);
        }
      }
    })
    .then(() => {
      Tips.find({ type: { $in: plants } }).then((tips) => {
        console.log(JSON.stringify(tips, null, 2));
        res.send(tips).status(200);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
