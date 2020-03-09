const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const autho = require("../../middleware/autho");

// sign up
router.post(
  "/",
  [
    check("name").isString(),
    check("email", "enter a valid email").isEmail(),
    check("password", "password must be at least 6 characters").isLength({
      min: 6
    })
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
          password
        });
        const token = await user.generateAuthToken();
        await user.save();
        res.json({ token,user }); // I removed to send {user}
      }
    }catch(error){
      res.status(500).json({msg:"Internal server error!"});
    }
      
    }
  }
);

router.post(
  "/login",
  [
    check("email", "please enter a valid email").isEmail(),
    check("password", "please enter a valid password").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ err: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // const user = await User.findByCredentials(email, password);
      const user = await User.findOne({email})
      if(!user){
        return res.status(400).json({msg:"User doesn't exist"});
      }
      const isMatch = await bcrypt.compare(password,user.password)
      if(!isMatch){
        return res.status(400).json({msg:"Invalid Email or Password"})
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

router.post("/logout",autho,async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
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

router.get("/",autho, async (req,res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user)
  } catch (error) {
    // console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
  
})

// update route
// private route 
// updates a user but doesnt check for valid emial and password. it result problems on login
router.patch("/me", autho, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["name", "email", "password"];
  const isvalidOperation = updates.every(update =>
    allowedUpdate.includes(update)
  );
  if (!isvalidOperation) {
    return res.status(400).send({ error: "Invalid update" });
  }
  try {
    updates.forEach(update => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.send(eror);
  }
});

module.exports = router;
