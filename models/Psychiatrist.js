const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const PsychiatristSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },role:{
      type:String,
      default:"psychiatrist"
    },
    date: {
      type: Date,
      default: Date.now()
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

PsychiatristSchema.virtual("articles",{
  ref:"article",
  localField:"_id",
  foreignField:"owner"
})

PsychiatristSchema.methods.toJSON = function() {
    const psychiatrist = this;
    const psychiatristObject = psychiatrist.toObject();
  
    delete psychiatristObject.password;
    delete psychiatristObject.tokens;
  
    return psychiatristObject;
  };

PsychiatristSchema.methods.generateAuthToken = async function() {
  const psychiatrist = this;
  try {
    const token = await jwt.sign(
      { _id: psychiatrist.id.toString(),role:psychiatrist.role },
      config.get("jwtSecret")
    );
    psychiatrist.tokens = psychiatrist.tokens.concat({ token });
    await psychiatrist.save();
    return token;
  } catch (error) {
    console.log(error)
  }
};

module.exports = mongoose.model("psychiatrist", PsychiatristSchema);
