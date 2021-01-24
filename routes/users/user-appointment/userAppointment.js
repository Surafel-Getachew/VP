const router = require("express").Router();
const auth = require("../../../middleware/autho");
const UserAppointment = require("../../../models/User/user-appointment/UserAppointment");
const PsychProfile = require("../../../models/Psychiatrist/psych-profile/PsychProfile");
const {
  createUserAppt,
  updateUserAppt,
  validateUserAppt,
  validateWithPsychSchedule,
  addPsychAppointment,
  updatePsychSchedule
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
  const psychApptInfo = {
    appointedTo:req.body[theDay][0].appointedTo,
    theDay:theDay,
    startTime:req.body[theDay][0].start,
    endTime:req.body[theDay][0].end,
    appointedBy:req.user._id
  }
  try {
    const userAppt = await UserAppointment.findOne({
      userAppointed: req.user._id,
    });
    if (userAppt == null) {
      const valid = await validateWithPsychSchedule(validationInfo);
      console.log(valid.value);
      console.log("psych validation",valid.value);
      if (valid.value){
        const result = await createUserAppt(req.user._id, req.body);
        if (result) {
          res.status(200).json({msg:"Appointed"});
          await addPsychAppointment(psychApptInfo);
          await updatePsychSchedule(valid.info);
        } else {
          res.status(500).json({msg:"Internal server error"})
        }
      } else {
        res.status(400).json({msg:"The Psychiatrist is not available at that time"})
      }
    } else if (userAppt[theDay].length == 0) {
      const valid = await validateWithPsychSchedule(validationInfo);
      if (valid.value){
        const pushValue = req.body[theDay];
        const result = await updateUserAppt(req.user.id, theDay, pushValue);
        if (result) {
          res.status(200).json({ msg: "Appointed." });
          await addPsychAppointment(psychApptInfo);
          await updatePsychSchedule(valid.info);
        } else {
          res.status(500).json({ msg: "Internal Server Error" });
        }
        console.log("zero length");
      } else {
        res.status(400).json({msg:"The Psychiatrist is not available at that time"})
      }
    } else {
      const valid = await validateWithPsychSchedule(validationInfo);
      if (valid.value){
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
          await addPsychAppointment(psychApptInfo);
          await updatePsychSchedule(valid.info)
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

router.get("/myAppointment/:date",auth,async(req,res) => {
  try {
    const userAppt = await UserAppointment.findOne({userAppointed:req.user.id});
    const todaysAppt = userAppt[req.params.date];
    let profile = [];
    // console.log(todaysAppt);
  for (let i=0; i<todaysAppt.length; i++) {
    const psychProfile = await PsychProfile.findOne({psychOwner:todaysAppt[i].appointedTo});
    // console.log(psychProfile);
    if (psychProfile.avatar == undefined){
      const apptData = {
        psychProfile,
        starTime:todaysAppt[i].start,
        endTime:todaysAppt[i].start
      }
      // profile.push(psychProfile);
      profile.push(apptData);
    } else {
      const avatar = Buffer.from(psychProfile.avatar).toString("base64");
      let cProfile = {
        name:psychProfile.name,
        avatar:avatar,
        startTime:todaysAppt[i].start,
        endTime:todaysAppt[i].end
      }
      profile.push(cProfile);
    }
  }
  res.status(200).send(profile);
  } catch (error) {
    res.status(500).send({msg:"Internal Server Error"});
    console.log(error.message);
  }
  
})

module.exports = router;
