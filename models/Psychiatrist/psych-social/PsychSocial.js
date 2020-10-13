const mongoose = require("mongoose");

const PsychSocial = mongoose.Schema({
  facebook: {
    type: String,
  },
  twitter: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  youtube: {
    type: String,
  },
  instagram: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "psychiatrist",
  },
});

module.exports = mongoose.model("psychSocial", PsychSocial);
