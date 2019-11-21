const config = require("config")
const db = require("../config/db");
// config.get("mongoURI")
// const conn = require("../config/db").connectDB();

const Psychiatrist = require("../models/Psychiatrist");

Psychiatrist.findOne({ name: "surafel" })
  .then(user => {
    console.log(user);
    return Psychiatrist.countDocuments();
  })
  .then(result => {
    console.log(result);
  }).catch((e) => {
      console.log(e)
  });
console.log("af")