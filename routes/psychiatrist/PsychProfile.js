const router = require("express").Router();
const PsychProfile = require("../../models/PsychProfile");
const Psychiatrist = require("../../models/Psychiatrist");
const auth = require("../../middleware/auth");
const multer = require("multer");

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

router.post("/", auth, async (req, res) => {
  // owner = req.psychiatrist._id
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
  } = req.body;

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
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).send(error);
    console.log(error.message);
  }
});

// router.post("/", auth, async (req, res) => {
//   const {
//     firstname,
//     lastname,
//     about,
//     address1,
//     address2,
//     city,
//     state,
//     country,
//     postalCode,
//     services,
//     specializations,
//     degree,
//     college,
//     yearOfCompletion,
//     hospitalName,
//     from,
//     to,
//     designation,
//     award,
//     year,
//     memberships,
//   } = req.body;
//   const profileFields = {
//     about,
//     services: Array.isArray(services)
//       ? services
//       : services.split(",").map((service) => "" + service.trim()),
//     specializations: Array.isArray(specializations)
//       ? specializations
//       : specializations
//           .split(",")
//           .map((specialization) => "" + specialization.trim()),
//     memberships: Array.isArray(memberships)
//       ? memberships
//       : memberships.split(",").map((memberships) => "" + memberships.trim()),
//     education: [],
//     experiences: [],
//     awards: [],
//   };

//   const basicinfoFields = { firstname, lastname };
//   for (const [key, value] of Object.entries(basicinfoFields)) {
//     if (value && value.length > 0) basicinfoFields[key] = value;
//   }
//   profileFields.basicInformation = basicinfoFields;

//   const addressFields = {
//     address1,
//     address2,
//     city,
//     state,
//     country,
//     postalCode,
//   };
//   for (const [key, value] of Object.entries(addressFields)) {
//     if (value && value.lenth > 0) addressFields[key] = value;
//   }
//   profileFields.contactDetails = addressFields;

//   const newEdu = { degree, college, yearOfCompletion };
//   profileFields.education.unshift(newEdu);

//   const newExp = { hospitalName, from, to, designation };
//   profileFields.experiences.unshift(newExp);

//   const newAward = { award, year };
//   profileFields.awards.unshift(newAward);

//   try {
//     let psychProfile = await PsychProfile.findOneAndUpdate(
//       {
//         psychOwner: req.psychiatrist._id,
//       },
//       { $set: profileFields },
//       { new: true, upsert: true }
//     );
//     await psychProfile.save();
//     res.status(201).json(psychProfile);
//   } catch (error) {
//     res.status(500).send(error);
//     console.error(error.message);
//   }
// });

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
    console.error(error.message);
  }
});

router.get("/:id",async (req,res) => {
  try {
    const profile = await PsychProfile.findOne({psychOwner:req.params.id});
    if (!profile) {
      res.status(400).send("Can't find psychiatrist")
    }
    res.status(200).send(profile)
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
