const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
// const sharp = require("sharp");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
// Psychiatrist DB
const Psychiatrist = require("../../models/Psychiatrist");
const passportStrategy = require("./passport/passportStrategy");


// post route
// signup psychiatrist
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
        res.status(201).send({ token, role: psychiatrist,msg:"Registered Succesfuly" }); // i removed sending the psychiatrist.
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
          return res.status(400).json({ msg: "Psychiatrist not found." });
        }
        const isMatch = await bcrypt.compare(password, psychiatrist.password);
        if (!isMatch) {
          return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const token = await psychiatrist.generateAuthToken();
        res.status(200).send({ psychiatrist, token, role: psychiatrist.role });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
    }
  }
);

// router.post("/google",passport.authenticate("googleToken"),{session:false},async(req,res) => {
//   console.log(req.psychiatrist);
//   const token = await req.psychiatrist.generateAuthToken()
//   res.send({token});
// })

router.post(
  "/google",
  passport.authenticate("googleToken", { session: false }),
  async (req, res) => {
    console.log(req.user,"from psych");
    const token = await req.user.generateAuthToken();
    res.send({ token });
  }
);


router.get("/:id",async (req,res) => {
  try {
    const psych = await Psychiatrist.findById(req.params.id).select("-password");
    if (!psych) {
      return res.status(400).send(psych)
    } else {
      res.status(200).send(psych)
    }
  } catch (error) {
    res.status(500).json({msg:"Internal Server Error"});
  }
})


router.get("/all",async(req,res) => {
  try {
    const psych = await Psychiatrist.find().select("-password");
    res.status(200).json(psych);
  } catch (error) {
    res.status(500).send(error.message);
  }
})


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

router.get("/", auth, async (req, res) => {
  try {
    const psychiatrist = await Psychiatrist.findById(
      req.psychiatrist.id
    ).select("-password");
    res.json(psychiatrist);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});


const upload = multer({
  limits: {
    fileSize: 1000000
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.jpg|jpeg|png/)) {
      return cb(new Error("File must an image"));
    }
    cb(undefined, true);
  }
});

router.post(
  "/profilePic",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.psychiatrist.avatar = buffer

    await req.psychiatrist.save();

    res.status(200).send();
  },
  (error, req, res, next) => {
    res.status(400).json({ msg: error.message });
  }
);

router.get("/profilePic", auth, async (req, res) => {
  try {
    const profile = await Psychiatrist.findById(req.psychiatrist._id);
    res.set("Content-Type", "image/png");
    res.status(200).send(profile.avatar);
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.log(error.message);
  }
});

router.get("/profilePic/:id", async (req, res) => {
  try {
    const profile = await Psychiatrist.findById(req.params.id);
    res.set("Content-Type", "image/png");
    res.status(200).send(profile.avatar);
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.log(error.message);
  }
});

router.delete("/profilePic", auth, async (req, res) => {
  req.psychiatrist.avatar = undefined;
  req.psychiatrist.save();
  res.status(200).send();
});

module.exports = router;
