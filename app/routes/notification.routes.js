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
        var temperatureSensorAlert = null;
        var lightIntensitySensorAlert = null;
        var humiditySensorAlert = null;


        var alertSoilMoisture = false; 
        var alertTemperature = false; 
        var alertLightIntensity = false; 
        var alertHumidity = false;  

 
        if (parseInt(unitData.soilMoistureSensor.lastReading) < 20 ) {
          alertSoilMoisture = true; 
          unitAlert = true;
          soilMoistureSensorAlert = { 
              value: unitData.soilMoistureSensor.lastReading,
              time: new Date(), 
              name: unitData.unitName
          
          };
        }

        if(parseInt(unitData.temperatureSensor.lastReading.substring(0,unitData.temperatureSensor.lastReading.length - 1)) < 20){
          alertTemperature= true;  
          unitAlert = true;
          temperatureSensorAlert  = { 
              value: unitData.temperatureSensor.lastReading.substring( 0, unitData.temperatureSensor.lastReading.length - 1),
              time: new Date(), 
              name: unitData.unitName
            
          };
        }

        if ( parseInt(unitData.lightIntensitySensor.lastReading.substring( 0, unitData.lightIntensitySensor.lastReading.length - 3 )) < 20 ) {
          alertLightIntensity = true; 
          unitAlert = true;
          console.log(unitData['unitName'])
          lightIntensitySensorAlert = { 
              value: unitData.lightIntensitySensor.lastReading.substring(0,unitData.lightIntensitySensor.lastReading.length - 3),
              time: new Date(), 
              name: unitData.unitName
          };
        }

        if (parseInt(unitData.humiditySensor.lastReading.substring(0,unitData.humiditySensor.lastReading.length - 1)) < 20 ) {
          alertHumidity = true; 
          unitAlert = true;
          humiditySensorAlert  = {
            humiditySensor: {
              value: unitData.humiditySensor.lastReading.substring( 0,unitData.humiditySensor.lastReading.length - 1),
              time: new Date(), 
              name: unitData.unitName
            },
          };
        }

        var alertObject = {} 

        if(alertSoilMoisture){
          alertObject = {
            soilMoistureSensorAlert
          }
        }
        if(alertTemperature){
          alertObject = {
            ...alertObject ,
            temperatureSensorAlert 
          }
        }
        if( alertLightIntensity){
          alertObject = {
            ...alertObject ,
            lightIntensitySensorAlert 
          }
        }
        if(alertHumidity){
          alertObject = {
            ...alertObject ,
            humiditySensorAlert 
          }
        }
        unitAlerts = {
          [unitData.moduleID]: {...alertObject },
        };
       
        if(unitAlert){ 
          alerts.push(unitAlerts)
        } 
        unitAlert = false;
      }
      console.log(JSON.stringify({state:alerts.length !=0,data:alerts}, null, 2)); 
      res.send( 
        {state:alerts.length !=0 ,
        data:alerts}
        ); 
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200);
});
module.exports = router;
