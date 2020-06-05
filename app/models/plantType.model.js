const mongoose = require("mongoose");

// Create Schema
const plantTypesSchema = new mongoose.Schema({
  plantName: {
    type: String,
    required: false,
  },

  fertilizerType1: {
    type: Number, 
    required: false,
  },

  fertilizerType2: {
    type: Number, 
    required: false,
  },

  fertilizerType3: {
    type: Number, 
    required: false,
  },

  water: {
    type: Number, 
    required: false,
  },
});

module.exports = mongoose.model("plants", plantTypesSchema);
