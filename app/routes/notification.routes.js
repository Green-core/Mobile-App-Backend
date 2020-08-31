const express = require("express");
const router = express.Router();
const Unit = require("../models/unit.model");
const ObjectId = require("mongoose").Types.ObjectId;

/**
 * @route   GET /notifications/check/:id
 * @desc    Check for notifications for a  user [true/false]
 * @access  Private
 */

router.get("/check/:id", (req, res) => {
  var haveNotifications = false;
  var alerts = [];

  Unit.find({ userID: req.params.id })
    .then((docs) => {
      for (var a in docs) {
        //check sensors one by one
        var unitData = docs[a];
        var unitAlert = false;
        var unitAlerts = null;
        var soilMoistureSensorAlert = null;
        var lightIntensitySensorAlert = null;
        const automated = docs[a].automated

        var alertSoilMoisture = false;
        var alertLightIntensity = false;

        if (parseInt(unitData.soilMoistureSensor.lastReading) < 20) {
          alertSoilMoisture = true;
          unitAlert = true;
          soilMoistureSensorAlert = {
            value: unitData.soilMoistureSensor.lastReading,
            time: new Date(),
            name: unitData.unitName,
            id:unitData.moduleID ,
            type: "SM",
          };
        }

        if (
          parseInt(
            unitData.lightIntensitySensor.lastReading.substring(
              0,
              unitData.lightIntensitySensor.lastReading.length - 3
            )
          ) < 20
        ) {
          alertLightIntensity = true;
          unitAlert = true;
          console.log(unitData["unitName"]);
          lightIntensitySensorAlert = {
            value: unitData.lightIntensitySensor.lastReading.substring(
              0,
              unitData.lightIntensitySensor.lastReading.length - 3
            ),
            time: new Date(),
            name: unitData.unitName,
            id:unitData.moduleID ,
            type: "LT",
          };
        }

        if (alertSoilMoisture && !automated) {
          alerts.push({...soilMoistureSensorAlert  });
        }

        if (alertLightIntensity && !automated) {
          alerts.push({...lightIntensitySensorAlert  });
        }

        unitAlert = false;
      }
      console.log(
        JSON.stringify({ state: alerts.length != 0, data: alerts }, null, 2)
      );
      res.send({ state: alerts.length != 0, data: alerts });
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200);
});
module.exports = router;
