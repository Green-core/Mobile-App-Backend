const express = require("express");
const router = express.Router();
const Unit = require("../models/actuatorModel.js");
const ObjectId = require('mongoose').Types.ObjectId; 


router.post("/update-light-status", (req, res) => {

    const time = new Date()
      
    // const lightActuatorReading = {
    //   state: req.body.state,
    //   time: time
    // }
      console.log(req.body)
      Unit.updateOne(
        { moduleID: req.body.moduleID },
        {
          updatedAt: time,
          
          //Light Actuator
          "lightActuator.activated": req.body.activated,
          "lightActuator.lastUpdatedTime": time,
        },
        { upsert: true }
      ).then((result) => {
        res.send(result)
      })
        .catch((err) => {
          console.log(err)
        })
      res.status(200)
    })
  
    
  
  module.exports = router;