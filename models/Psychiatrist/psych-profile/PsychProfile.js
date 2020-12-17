const mongoose = require("mongoose");
const PsychProfileSchema = mongoose.Schema({
  avatar:{
    type:Buffer
  },
  name: {
    type: String,
  },
  about: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  gender: {
    type: String,
  },
  education: [
    {
      educationStatus: {
        type: String,
      },
      Inistitute: {
        type: String,
      },
    },
  ],
  experience:[
    {
      workplace: {
        type:String
      },
      years:{
        type:[Date]
      }
    }
  ],
  service: {
    type: [String],
  },
  specializations: {
    type: [String],
  },
  
  psychOwner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "psychiatrist",
  },
});

module.exports = mongoose.model("psychProfile", PsychProfileSchema);
