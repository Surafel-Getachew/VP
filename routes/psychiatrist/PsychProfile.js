const router = require("express").Router();
const PsychProfile = require("../../models/PsychProfile");
const Psychiatrist = require("../../models/Psychiatrist");
const auth = require("../../middleware/auth");
const multer = require("multer");

// router.post("/", auth, async (req, res) => {
//   const {
//     basicInformation,
//     // firstname,
//     // lastname,
//     about,
//     contactDetails,
//     services,
//     specialization,
//     education,
//     experience,
//     awards,
//     memberships,
//   } = req.body;

//   const profileFields = {
//     basicInformation,
//     // firstname,
//     // lastname,
//     about,
//     contactDetails,
//     services,
//     specialization,
//     education,
//     experience,
//     awards,
//     memberships,
//     psychOwner: req.psychiatrist._id,
//   };

//   try {
//     let psychProfile = await PsychProfile.findOneAndUpdate(
//       {
//         psychOwner: req.psychiatrist._id,
//       },
//       { $set: profileFields },
//       { new: true, upsert: true }
//     );

//     await psychProfile.save();
//     res.status(201).json( psychProfile );
//   } catch (error) {
//     res.status(500).send(error);
//     console.error(error.message);
//   }
// });

// router.post("/", auth, async (req, res) => {
//   const { firstname, lastname } = req.body;
//   // const profileFields = {
//   //   basicInformation,
//   //   psychOwner:req.psychiatrist._id
//   // };
//   const profileFields = { psychOwner: req.psychiatrist._id };
//   const basicInformationField = { firstname, lastname };
//   profileFields.basicInformation = basicInformationField;
//   for (const [key, value] of Object.entries(basicInformationField)) {
//     if (value && value.length > 0) basicInformationField[key] = value;
//   }
//   profileFields.basicInformation = basicInformationField;
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

router.post("/", auth, async (req, res) => {
  const {
    firstname,
    lastname,
    address1,
    address2,
    city,
    state,
    country,
    postaCode,
    services,
    specializations,
    degree,
    college,
    yearOfCompletion,
    hospitalName,
    from,
    to,
    designation,
    award,
    year,
    member,


  } = req.body;
  const profileFields = {
    services: Array.isArray(services)
      ? services
      : services.split(",").map((service) => "" + service.trim()),
    specializations: Array.isArray(specializations)
      ? sepecializations
      : specializations
          .split(",")
          .map((specialization) => "" + specialization.trim()),
    education: [],
    experiences:[],
    awards:[],
    memberships:[]
  };

  const basicinfoFields = { firstname, lastname };
  for (const [key, value] of Object.entries(basicinfoFields)) {
    if (value && value.length > 0) basicinfoFields[key] = value;
  }
  profileFields.basicInformation = basicinfoFields;

  const addressFields = { address1, address2, city, state, country, postaCode };
  for (const [key, value] of Object.entries(addressFields)) {
    if (value && value.lenth > 0) addressFields[key] = value;
  }
  profileFields.contactDetails = addressFields;

  const newEdu = {degree,college,yearOfCompletion}
  profileFields.education.unshift(newEdu)
 
  const newExp = {hospitalName,from,to,designation}
  profileFields.experiences.unshift(newExp)
  
  const newAward = {award,year}
  profileFields.awards.unshift(newAward)
  
  const newMemb = {member}
  profileFields.memberships.unshift(newMemb);

  try {
    let psychProfile = await PsychProfile.findOneAndUpdate(
      {
        psychOwner: req.psychiatrist._id,
      },
      { $set: profileFields },
      { new: true, upsert: true }
    );
    await psychProfile.save();
    res.status(201).json(psychProfile);
  } catch (error) {
    res.status(500).send(error);
    console.error(error.message);
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
    console.error(error.message);
  }
});

// router.get("/", (req, res) => {
//   try {
//     const profile = PsychProfile.find();
//     res.json({ profile });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

module.exports = router;
