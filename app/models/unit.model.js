const mongoose = require("mongoose");

// Create Schema
const unitSchema = new mongoose.Schema({
  soilMoistureSensor: {
    lastReading: {
      type: "String",
    },
    lastUpdatedTime: {
      $date: {
        type: "Date",
      },
    },
    pastReadings: {
      type: ["Mixed"],
    },
  },
  temperatureSensor: {
    lastReading: {
      type: "String",
    },
    lastUpdatedTime: {
      $date: {
        type: "Date",
      },
    },
    pastReadings: {
      type: ["Mixed"],
    },
  },
  lightIntensitySensor: {
    lastReading: {
      type: "String",
    },
    lastUpdatedTime: {
      $date: {
        type: "Date",
      },
    },
    pastReadings: {
      type: ["Mixed"],
    },
  },
  humiditySensor: {
    lastReading: {
      type: "String",
    },
    lastUpdatedTime: {
      $date: {
        type: "Date",
      },
    },
    pastReadings: {
      type: ["Mixed"],
    },
  },
  waterMotorActuator: {
    activated: {
      type: "Boolean",
    },
    lastUpdatedTime: {
      $date: {
        type: "Date",
      },
    },
  },
  lightActuator: {
    activated: {
      type: "Boolean",
    },
    lastUpdatedTime: {
      $date: {
        type: "Date",
      },
    },
  },
  buzzerActuator: {
    activated: {
      type: "Boolean",
    },
    lastUpdatedTime: {
      $date: {
        type: "Date",
      },
    },
  },
  fertilizerActuator: {
    activated: {
      type: "Boolean",
    },
    lastUpdatedTime: {
      $date: {
        type: "Date",
      },
    },
  },
  userID: {
    $oid: {
      type: "ObjectId",
    },
  },
  moduleID: {
    $oid: {
      type: "ObjectId",
    },
  },
  userName: {
    type: "String",
  },
  location: {
    type: "String",
  },
  createdAt: {
    $date: {
      type: "Date",
    },
  },
  updatedAt: {
    $date: {
      type: "Date",
    },
  },
  __v: {
    type: "Number",
  },
});

module.exports = mongoose.model("units", unitSchema);
