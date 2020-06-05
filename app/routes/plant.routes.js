const express = require("express");
const router = express.Router();
const PlantTypes = require("../models/plantType.model"); 

/**
 * @route   GET /plants/get
 * @desc    Retrieve all plant types
 * @access  Private
 */ 

router.get("/get", async (req, res) => {
    try {
      const plants = await PlantTypes.find();
      if (!plants) throw Error("No plants exist");
      console.log(plants)
      res.json(plants);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  });


module.exports = router;
