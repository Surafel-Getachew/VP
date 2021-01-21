const express = require("express");
const passport = require("passport");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const config = require("config");
const JWT_SECRETE = config.get("JWT_SECRETE");
const SERVER_ADDRESS = config.get("SERVER_ADDRESS");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const autho = require("../../middleware/autho");
const adminAuth = require("../../middleware/adminAuth");
const UserProfile = require("../../models/User/UserProfile/UserProfile");
const userPassport = require("./passport");

// sign up
router.post(
  "/",
  [
    check("name").isString(),
    check("email", "enter a valid email").isEmail(),
    check("password", "password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ err: errors.array() });
    } else {
      const { name, email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ msg: "User already exist" });
        } else {
          user = new User({
            name,
            email,
            password,
          });
          const token = await user.generateAuthToken();
          await user.save();
          res.json({ token, user }); // I removed to send {user}
        }
      } catch (error) {
        res.status(500).json({ msg: "Internal server error!" });
      }
    }
  }
);

router.post(
  "/login",
  [
    check("email", "please enter a valid email").isEmail(),
    check("password", "please enter a valid password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ err: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // const user = await User.findByCredentials(email, password);
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "User doesn't exist" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Email or Password" });
      }
      const token = await user.generateAuthToken();
      res.send({ user, token });
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

// post request
// logout on a single devices on which ur logged in.

router.post("/logout", autho, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// post request
// logout from all devices

router.post("/logoutall", autho, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    req.status(500).send(error);
  }
});
// delete request.
// delete a single user used for admin page.
router.delete("/me", autho, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {}
});

// get single users
// private route
// get request

router.get("/me", autho, async (req, res) => {
  res.send(req.user);
});

// get a user with a token included
// private route
// get request

router.get("/", autho, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json("error babe");
    // console.error(error.message);
    // res.status(500).send("Internal Server Error");
  }
});

// update route
// private route
// updates a user but doesnt check for valid emial and password. it result problems on login
router.patch("/me", autho, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["name", "email", "password"];
  const isvalidOperation = updates.every((update) =>
    allowedUpdate.includes(update)
  );
  if (!isvalidOperation) {
    return res.status(400).send({ error: "Invalid update" });
  }
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.send(eror);
  }
});

router.post(
  "/google",
  passport.authenticate("googleToken", { session: false }),
  async (req, res) => {
    console.log(req.user);
    const token = await req.user.generateAuthToken();
    res.send({ token });
  }
);

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    // user: "virtualpsychiatristET@gmail.com", 
    // pass: "virtualpsychiatristwebapppass",
    // user: "virtualpsychiatristet@gmail.com",
    // pass: "virtualpsych",
    user:"virtualpsychiatristet@gmail.com",
    pass:"virtualpsych"
  },
});

router.post("/sendResetPasswordEmail", async (req, res) => {
  try {
    const { email } = req.body;
    const findEmail = await User.findOne({ email: email });
    if (!findEmail) {
      res.status(400).json({ msg: "Email not found" });
    }
    const reset_token = jwt.sign({ email }, JWT_SECRETE, {
      expiresIn: "1h",
    });
    const url = `http://${SERVER_ADDRESS}/reset-password?token=${reset_token}`;
    const data = await ejs.renderFile("./views/email.ejs", {
      resetlink: url,
    });
    transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: data,
    });
    res
      .status(200)
      .json({
        reset_token,
        msg: "Confirmation Email sent, please check your email",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "sending reset password email failed" });
  }
});

router.post("/resetPassword", async (req, res) => {
  try {
    const decodedToken = jwt.decode(req.body.token);
    const user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      res.status(400).json({ msg: "Invalid token can't find email!" });
    }
    user.password = req.body.password;
    await user.save();
    res.status(200).send("your password has been reset!");
  } catch (error) {
    res.status(500).send("Error occured while reseting your password");
  }
});

router.get("/admin/total",adminAuth,async(req,res) => {
  try {
    const numberOfUser = await User.countDocuments();
    res.status(200).send(numberOfUser.toString());
  } catch (error) {
    res.status(500).send({msg:"Internal Server Error"});
  }
});

router.delete("/:id",adminAuth,async(req,res) => {
  try {
    const user = await User.findOneAndDelete({_id:req.params.id});
    const userProfile = await UserProfile.findOneAndDelete({profileOwner:req.params.id})
    if(!user){
      res.status(200).send("user not found");
    }
    res.status(200).send()
  } catch (error) {
    console.log(error.message);
    res.status(500).json({msg:"Internal Server Error"});
  }
})

module.exports = router;
