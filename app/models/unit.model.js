const mongoose = require("mongoose");

// Create Schema
const unitSchema = new mongoose.Schema({
 
  ownerID:{
    type: String,
    required: true,
  },

  unitID: {
    type: String,
    required: true,
  },

  deviceName: {
    type: String,
    required: true,
    unique: true,
  },

  plantType: {
    type: String,
    required: true,
    unique: true,
  },

  location: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: new Date(),
    required: true,
  },

  updatedAt: {
    type: Date,
    default: new Date(),
    required: true,
  },

  sensors: [
    {
      label: {
        type: String,
        required: true,
      },
      lastReading: {
        type: String,
        required: true,
      },
      readings: [
        {
          time: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
}); 
 
module.exports = mongoose.model("linked_units", unitSchema);
