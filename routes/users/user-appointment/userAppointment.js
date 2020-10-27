const router = require("express").Router();
const auth = require("../../../middleware/autho");
const UserAppointment = require("../../../models/User/user-appointment/UserAppointment");
const {
  createUserAppt,
  updateUserAppt,
  validateUserAppt,
  validateWithPsychSchedule
} = require("./userApptHelper");
router.get("/", auth, (req, res) => {
  // res.send("user appointment router")
  res.send(req.user);
});

router.post("/", auth, async (req, res) => {
  const {
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  } = req.body;
  let theDay;
  for (const day in req.body) {
    theDay = day;
  }
  const newStartTime = req.body[theDay][0].start;
  const validationInfo = {
    appointedTo:req.body[theDay][0].appointedTo,
    theDay:theDay,
    apptStart:req.body[theDay][0].start,
    apptEnd:req.body[theDay][0].end
  }
  try {
    const userAppt = await UserAppointment.findOne({
      userAppointed: req.user._id,
    });
    if (userAppt == null) {
      const valid = await validateWithPsychSchedule(validationInfo)
      console.log("psych validation",valid);
      if (valid){
        const result = await createUserAppt(req.user._id, req.body);
        if (result) {
          res.status(200).json({msg:"Appointed"});
        } else {
          res.status(500).json({msg:"Internal server error"})
        }
      } else {
        res.status(400).json({msg:"The Psychiatrist is not available at that time"})
      }
    } else if (userAppt[theDay].length == 0) {
      const valid = await validateWithPsychSchedule(validationInfo);
      if (valid){
        const pushValue = req.body[theDay];
        const result = await updateUserAppt(req.user.id, theDay, pushValue);
        if (result) {
          res.status(200).json({ msg: "Appointed." });
        } else {
          res.status(500).json({ msg: "Internal Server Error" });
        }
        console.log("zero length");
      } else {
        res.status(400).json({msg:"The Psychiatrist is not available at that time"})
      }
    } else {
      const valid = await validateWithPsychSchedule(validationInfo);
      if (valid){
        console.log("validation step");
      const pushValue = req.body[theDay];
      const info = {
        userAppointedId: req.user._id,
        theDay: theDay,
        newStartTime: newStartTime,
      };
      const result = await validateUserAppt(info);
      console.log("validation result", result);
      if (result) {
        const result = await updateUserAppt(req.user._id, theDay, pushValue);
        if (result) {
          console.log("validated and saved");
          res.status(200).json({ msg: "Appointed" });
        }
      } else {
        console.log("You have appt at this time");
        res.status(400).json({ msg: "You have appointment at this time." });
      }
      } else {
        res.status(400).json({msg:"The Psychiatrist is not available at this point in time"})
      }
      
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
