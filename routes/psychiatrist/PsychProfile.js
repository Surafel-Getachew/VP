const router = require("express").Router();
const PsychProfile = require("../../models/PsychProfile");
const Psychiatrist = require("../../models/Psychiatrist");
const auth = require("../../middleware/auth");
const multer = require("multer");

router.post("/", auth, async (req, res) => {
  const {
    basicInformation,
    about,
    contactDetails,
    services,
    specialization,
    education,
    experience,
    awards,
    memberships,
  } = req.body;

  const profileFields = {
    basicInformation,
    about,
    contactDetails,
    services,
    specialization,
    education,
    experience,
    awards,
    memberships,
    psychOwner: req.psychiatrist._id,
  };

  try {
    let psychProfile = await PsychProfile.findOneAndUpdate(
      {
        psychOwner: req.psychiatrist._id,
      },
      { $set: profileFields },
      { new: true, upsert: true }
    );

    await psychProfile.save();
    res.status(201).json({ psychProfile });
  } catch (error) {
    res.status(500).send(error);
    console.error(error.message);
  }
});

router.get("/", (req, res) => {
  try {
    const profile = PsychProfile.find();
    res.json({ profile });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
