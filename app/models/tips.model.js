const mongoose = require("mongoose");

// Create Schema
const plantTipsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    required: true,
  },

  tips: [
    { 
      title:{
        type:String
      },
      body:{
        type:String
      }
    },
  ],
});

module.exports = mongoose.model("tips", plantTipsSchema);
