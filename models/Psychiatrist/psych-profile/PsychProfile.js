const mongoose = require("mongoose");

const PsychProfileSchema = mongoose.Schema({
  // basicInformation: {
  //   firstname: {
  //     type: String,
  //     required: true,
  //   },
  //   lastname: {
  //     type: String,
  //     required: true,
  //   },
  //   dateofbirth: {
  //     type: String,
  //   },
  // },
  // about: {
  //   type: String,
  // },
  // contactDetails: {
  //   address1: {
  //     type: String,
  //   },
  //   address2: {
  //     type: String,
  //   },
  //   city: {
  //     type: String,
  //   },
  //   state: {
  //     type: String,
  //   },
  //   country: {
  //     type: String,
  //   },
  //   postalCode: {
  //     type: String,
  //   },
  // },

  // services: {
  //   type: [String],
  //   required:true
  // },
  // specializations: {
  //   type: [String],
  //   required:true
  // },
  // education: [
  //   {
  //     degree: {
  //       type: String,
  //     },
  //     college: {
  //       type: String,
  //     },
  //     yearOfCompletion: {
  //       type: String,
  //     },
  //   },
  // ],
  // experiences: [
  //   {
  //     hospitalName: {
  //       type: String,
  //     },
  //     from: {
  //       type: String,
  //     },
  //     to: {
  //       type: String,
  //     },
  //     designation: {
  //       type: String,
  //     },
  //   },
  // ],
  // awards: [
  //   {
  //     award: {
  //       type: String,
  //     },
  //     year: {
  //       type: String,
  //     },
  //   },
  // ],
  // memberships: {
  //   type:[String]
  // },
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
  service: {
    type: [String],
  },
  specializations: {
    type: [String],
  },
  experience: [
    {
      workplace: {
        type: String,
      },
      years: {
        type:[]
      }
    },
  ],
  psychOwner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "psychiatrist",
  },
});

module.exports = mongoose.model("psychProfile", PsychProfileSchema);
