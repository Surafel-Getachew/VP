const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    // required:true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  role:{
    type:String,
    default:"user"
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

UserSchema.virtual("tasks", {
  ref: "task",
  localField: "_id",
  foreignField: "owner"
});

UserSchema.virtual("userProfiles",{
  ref:"userProfile",
  localField:"_id",
  foreignField:"profileOwner"
})

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

UserSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

UserSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id.toString(),role:user.role},
    config.get("jwtSecret")
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    // throw new Error("Invalid credintial");
    return JSON({msg:"User doesnt extis"})
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credintial");
  }
  return user;
};
const User = mongoose.model("user", UserSchema);

module.exports = mongoose.model("user", UserSchema);
