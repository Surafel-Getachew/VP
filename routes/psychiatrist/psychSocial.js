const router = require("express").Router();
const PsychSocial = require("../../models/Psychiatrist/psych-social/PsychSocial");
const auth = require("../../middleware/auth");
const {
  findOneAndUpdate,
} = require("../../models//Psychiatrist/psych-social/PsychSocial");

router.post("/", auth, async (req, res) => {
  const { facebook, twitter, youtube, linkedin, instagram } = req.body;
  const psychSocial = await PsychSocial.findOne({
    owner: req.psychiatrist._id,
  });
  if (psychSocial) {
    const updates = Object.keys(req.body);
    updates.forEach((update) => {
      psychSocial[update] = req.body[update];
    });
    await psychSocial.save();
  } else {
    const newPsychSocial = new PsychSocial({
      facebook,
      twitter,
      youtube,
      linkedin,
      instagram,
      owner: req.psychiatrist._id,
    });
    await newPsychSocial.save();
  }
  res.status(200).json(psychSocial);
});

router.get("/me", auth, async (req, res) => {
  const psychSocial = await PsychSocial.findOne({
    owner: req.psychiatrist._id,
  });
  if (!psychSocial) {
    res.status(400).send("Psych social not found");
  } else {
    try {
      res.status(200).json(psychSocial);
    } catch (error) {
      res.send(error.message);
    }
  }
});

module.exports = router;
