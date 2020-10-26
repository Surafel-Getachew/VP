const express = require("express");
const router = express.Router();
const Psychiatrist = require("../../models/Psychiatrist");
const auth = require("../../middleware/auth");

router.get("/", auth, async (req, res) => {
  // try {
  //   const psychiatrist = await Psychiatrist.findById(req.psychiatrist).select(
  //     "-password"
  //   );
  //   res.json( psychiatrist );
  // } catch (error) {
  //   console.error(error.message);
  //   res.status(500).send("Server Error");
  // }
  try {
    res.status(200).send(req.psychiatrist)
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
