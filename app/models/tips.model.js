const mongoose = require("mongoose");
const plantTipsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },

  tips: [
    {
      title: {
        type: String,
      },
      body: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("tips", plantTipsSchema);
