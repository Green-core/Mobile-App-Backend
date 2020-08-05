const mongoose = require("mongoose");

// Create Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "user",
    required: true,
  },
  
  mobile:{ 
    type: String, 
    required: false,
  },
  resetPasswordToken :{
    type:String,
    required: false,
  },
  resetPasswordExpire :{
    type:Date,
    required: false,
  },

  emailVerify:{
    type:Boolean,
    default:false,
  },

  created_at: {
    type: Date,
    default: new Date(),
    required: true,
  },

  updated_at: {
    type: Date,
    default: new Date(),
    required: true,
  },

  modules: [
    {
      module_id: {
        type: String,
        required: true,
      },
      connected_date: {
        type: String,
        default: new Date(),
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
