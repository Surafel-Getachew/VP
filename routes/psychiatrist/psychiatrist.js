const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
// Psychiatrist DB
const Psychiatrist = require("../../models/Psychiatrist");

// post route
// signup user
// public
// completed
router.post(
  "/",
  [
    check("name").isString(),
    check("email").isEmail(),
    check("password").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ err: errors.array() });
    } else {
      const { name, email, password } = req.body;
      let psychiatrist = await Psychiatrist.findOne({ email });
      if (psychiatrist) {
        res.status(400).json({ msg: "Psychiatrist already exist" });
      } else {
        psychiatrist = new Psychiatrist({
          name,
          email,
          password
        });
        const salt = await bcrypt.genSalt(10);
        psychiatrist.password = await bcrypt.hash(password, salt);

        await psychiatrist.save();

        const token = await psychiatrist.generateAuthToken();
        res.status(201).send({ token,role:psychiatrist }); // i removed sending the psychiatrist.
      }
    }
  }
);

// post route
// signin psychiatrist
// public
// completed
router.post(
  "/login",
  [
    check("email", "include a valid email").isEmail(),
    check("password", "include a valid password").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    } else {
      const { email, password } = req.body;
      try {
        const psychiatrist = await Psychiatrist.findOne({ email });
        if (!psychiatrist) {
          return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const isMatch = await bcrypt.compare(password, psychiatrist.password);
        if (!isMatch) {
          return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const token = await psychiatrist.generateAuthToken();
        res.status(200).send({ psychiatrist, token, role:psychiatrist.role });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
    }
  }
);

// get a single profile
// private
// get request

router.get("/me", auth, (req, res) => {
  try {
    res.status(200).send(req.psychiatrist);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/",auth,async(req,res) => {
  try {
    const psychiatrist = await (Psychiatrist.findById(req.psychiatrist.id)).select("-password")
    res.json(psychiatrist)
  } catch (error) {
    res.status(500).send("Internal Server Error")
  }
})

module.exports = router;
