const router = require("express").Router();
const multer = require("multer")
const path = require("path");
const PsychProfile = require("../../models/Psychiatrist/psych-profile/PsychProfile");
const Psychiatrist = require("../../models/Psychiatrist");
const Avi = require("../../models/Psychiatrist/psych-profile/Avi");
const auth = require("../../middleware/auth");

var upload = multer({
  // limits:{
  //   fileSize:3000000 //equals 3mb 
  // },
  // fileFilter(req,file,cb){
  //   if (!file.originalname.match(/\.(jpg|png|JPG|PNG|JPEG|jpeg)$/)){
  //     return cb( new Error("This is not supported format "))
  //     cb(undefined,true)
  //   }
  // }
});

router.get("/all", async (req, res) => {
  try {
    const profile = await PsychProfile.find();
    // res.json({ profile });
    res.status(200).send(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/",auth,async (req, res) => {
  const {
    name,
    gender,
    city,
    country,
    state,
    about,
    service,
    specializations,
    education,
    experience,
  } = req.body
  const psychProfile = {
    name,
    gender,
    city,
    country,
    state,
    about,
    service,
    specializations,
    education,
    experience,
    psychOwner: req.psychiatrist._id,
  };


  try {
    let profile = await PsychProfile.findOneAndUpdate(
      {
        psychOwner: req.psychiatrist._id,
      },
      { $set: psychProfile },
      { new: true, upsert: true }
    );
    await profile.save();
    console.log(profile);
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).send(error);
    console.log(error.message);
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await PsychProfile.findOne({
      psychOwner: req.psychiatrist._id,
    });
    if (!profile) {
      res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).send(error);
    // console.error(error.message);
  }
});

router.post("/avatar",upload.single("avatar"),auth,async(req,res) => {
  const psychProfile = {
    avatar:req.file.buffer
  }
  try {
   let profile = await PsychProfile.findOneAndUpdate(
     {
       psychOwner: req.psychiatrist._id,
     },
     { $set: psychProfile },
     { new: true, upsert: true }
   );
   await profile.save();
   console.log(profile);
   res.status(201).json(profile);
 } catch (error) {
   res.status(500).send(error);
   console.log(error.message);
 }
 })

router.get("/avatar",auth,async(req,res) => {
  try {
    const profile = await PsychProfile.findOne({psychOwner:req.psychiatrist._id});
    if (!profile.avatar) {
      return res.status(400).send({msg:"Doesn't hava an avatar"})
    } else {
      const avatar = Buffer.from(profile.avatar).toString("base64");
      return res.status(200).json(avatar)
    }
  } catch (error) {
    return res.status(500).json({msg:"Internal Server Erro"})
  }
})

router.get("/:id",async (req,res) => {
  try {
    const profile = await PsychProfile.findOne({psychOwner:req.params.id});
    if (!profile) {
      res.status(400).send("Can't find psychiatrist")
    }
    // profile.convertedAvatar = Buffer.from(profile.avatar).toString("base64");
    res.status(200).send(profile);
  } catch (error) {
    res.status(500).send("Internal Server Error")
  }
})

// router.get("/",async(req,res) => {
//   try {
//     const profile = await PsychProfile.find();
//     res.json({profile})
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// })

module.exports = router;
