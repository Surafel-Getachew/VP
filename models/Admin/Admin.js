const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const AdminSchema = mongoose.Schema(
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
    tokens: [
        {
          token: {
            type: String,
            required: true,
          },
        },
      ],
})


AdminSchema.methods.toJSON = function () {
    const admin = this;
    const adminObject = admin.toObject();
  
    delete adminObject.password;
    delete adminObject.tokens;
  
    return adminObject;
  };


AdminSchema.methods.generateAuthToken = async function () {
    const admin = this;
    try {
      const token = await jwt.sign(
        { _id: admin.id.toString()},
        config.get("jwtSecret")
      );
      admin.tokens = admin.tokens.concat({ token });
      await admin.save();
      return token;
    } catch (error) {
      console.log(error);
    }
  };
  module.exports = mongoose.model("admin",AdminSchema)