const router = require("express").Router();
const multer = require("multer")
const path = require("path");
const PsychProfile = require("../../models/Psychiatrist/psych-profile/PsychProfile");
const Psychiatrist = require("../../models/Psychiatrist");
const Avi = require("../../models/Psychiatrist/psych-profile/Avi");
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
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
    // console.log(profile);
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
    return res.status(500).json({msg:"Internal Server Error"})
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

router.get(`/basic/:id`,async(req,res) => {
  try {
    const profile = await PsychProfile.findOne({psychOwner:req.params.id});
    if (!profile) {
      return res.status(400).send({msg:"Can't find psychiatrist"});
    } else {
      if (profile.avatar !== undefined) {
        const avatar = Buffer.from(profile.avatar).toString("base64");
        return res.status(200).json({name:profile.name,avatar:avatar});
      } else {
        return res.status(200).json({name:profile.name})
      }
    }
  } catch (error) {
    return res.status(500).send({msg:"Internal Server Error"})
  }
});

router.get("/all/basic",async(req,res) => {
 try {
   const profile = await PsychProfile.find();
   if (!profile) {
     res.status(400).json({msg:"Can't find profiles"})
   } else {
    const profiles = []
    for (let i=0; i<profile.length; i++) {

    // profile.forEach(async(prof) => {
      let email
      let avatar
      let emailAddress = await Psychiatrist.findById(profile[i].psychOwner);
      if (emailAddress) {
        email = emailAddress.email
      }
      if (profile[i].avatar !== undefined) {
        avatar = Buffer.from(profile[i].avatar).toString("base64");
        profiles.push({name:profile[i].name,avatar:avatar,email:email,psychOwner:profile[i].psychOwner});
      } else {
        profiles.push({name:profile[i].name,avatar:profile[i].avatar,email:email,psychOwner:profile[i].psychOwner});
      }
    }
    // })
    res.status(200).send(profiles);
   }
 } catch (error) {
   console.log(error);
   return res.status(500).json({msg:"Interanl Server Error"});
 }

})

router.post("/search/all",adminAuth,async(req,res) => {
  try {
    const {
      searchText
    } = req.body;
    let psychsList = [];
    const psychs = await PsychProfile.find({$text:{$search:searchText}})
    psychs.forEach((psych) => {
      if(psych.avatar == undefined) {
        psychsList.push(psych)
      } else {
        let psychAvatar = Buffer.from(psych.avatar).toString("base64");
        let psychData = {
          ...psych._doc,
          avatar:psychAvatar
        }
        psychsList.push(psychData);
      }
    })
    res.status(200).send(psychsList)
  } catch (error) {
    res.status(500).send({msg:"Internal Server Error"});
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
