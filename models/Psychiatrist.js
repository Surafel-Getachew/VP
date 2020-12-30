const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const PsychiatristSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "psychiatrist",
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    avatar: {
      type: Buffer,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

PsychiatristSchema.virtual("articles", {
  ref: "article",
  localField: "_id",
  foreignField: "owner",
});
PsychiatristSchema.virtual("groupVideoChats",{
  ref:"groupVideoChat",
  localField:"_id",
  foreignField:"roomOwner"
})
PsychiatristSchema.virtual("messages", {
  ref: "message",
  localField: "_id",
  foreignField: "sender",
});
PsychiatristSchema.virtual("messages", {
  ref: "message",
  localField: "_id",
  foreignField: "reciver",
});

PsychiatristSchema.virtual("psychProfiles", {
  ref: "psychProfile",
  localField: "_id",
  foreignField: "profileOwner",
});

PsychiatristSchema.virtual("psychSocials", {
  ref: "psychSocial",
  localField: "_id",
  foreignField: "owner",
});
PsychiatristSchema.virtual("avi", {
  ref: "avi",
  localField: "_id",
  foreignField: "aviOwner",
});

PsychiatristSchema.methods.toJSON = function () {
  const psychiatrist = this;
  const psychiatristObject = psychiatrist.toObject();

  delete psychiatristObject.password;
  delete psychiatristObject.tokens;
  delete psychiatristObject.avatar;

  return psychiatristObject;
};

PsychiatristSchema.methods.generateAuthToken = async function () {
  const psychiatrist = this;
  try {
    const token = await jwt.sign(
      { _id: psychiatrist.id.toString(), role: psychiatrist.role },
      config.get("jwtSecret")
    );
    psychiatrist.tokens = psychiatrist.tokens.concat({ token });
    await psychiatrist.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoose.model("psychiatrist", PsychiatristSchema);
