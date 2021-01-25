const router = require("express").Router();
const moment = require("moment");
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const PsychSchedule = require("../../models//Psychiatrist/psych-schedule/PsychSchedule");
// const { modelName } = require("../../models/PsychSchedule");

router.get("/admin/allSchedule",adminAuth,async(req,res) => {
  let totalMonday = 0;
  let totalTuesday = 0;
  let totalWednesday = 0;
  let totalThursday = 0;
  let totalFriday = 0;
  let totalSaturday = 0;
  let totalSunday= 0;
  let days = {monday:"",tuesday:"",wednesday:"",thursday:"",friday:"",saturday:"",sunday:""}
  try {
    const schedule = await PsychSchedule.find();
    for(let i=0; i<schedule.length; i++){
      mondayLength = schedule[i].monday.length;
      totalMonday += mondayLength
      tuesdayLength = schedule[i].tuesday.length;
      totalTuesday += tuesdayLength
      wednesdayLength = schedule[i].wednesday.length;
      totalWednesday += wednesdayLength
      thursdayLength = schedule[i].thursday.length;
      totalThursday += thursdayLength
      fridayLength = schedule[i].friday.length;
      totalFriday += fridayLength
      saturdayLength = schedule[i].saturday.length;
      totalSaturday += saturdayLength
      sundayLength = schedule[i].sunday.length;
      totalSunday += sundayLength
    }
    days.monday = totalMonday.toString();
    days.tuesday = totalTuesday.toString()
    days.wednesday = totalWednesday.toString()
    days.thursday = totalThursday.toString()
    days.friday = totalFriday.toString()
    days.saturday = totalSaturday.toString()
    days.sunday = totalSunday.toString()
    res.status(200).send(days)
  } catch (error) {
    console.log(error.message);
    res.status(500).json({msg:"Internal Server Error"});
  } 
})

router.post("/", auth, async (req, res) => {
  console.log("req.body",req.body);
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
    // console.log("req.body",days);
    theDay = day;
  }
  const newStartTime = req.body[theDay][0].start;
  // console.log("req.ps", req.psychiatrist._id);
  let result;
  const schedules = await PsychSchedule.findOne({
    psychSchedule: req.psychiatrist._id,
  });
  // console.log("check first",schedules[theDay]);
  if (schedules == null) {
    result = true;
  } else {
    if (schedules[theDay].length == 0) {
      result = true;
    } else {
      // console.log("the second schedule of the day:", schedules[theDay]);
      schedules[theDay].forEach((schedule) => {
        const oldEndHr = new Date(schedule.end).getHours();
        const oldEndMin = new Date(schedule.end).getMinutes();
        const oldStartHr = new Date(schedule.start).getHours();
        const oldStartMin = new Date(schedule.start).getMinutes();
        const newScheduleHr = new Date(newStartTime).getHours();
        const newScheduleMinn = new Date(newStartTime).getMinutes();
        const newScheduleMin = parseInt ("" + "0" + newScheduleMinn);
        // if saved old min is less than 9 add 0 to the end of it.
        let oldEndHrMin;
        let oldStartHrMin;
        let newSchedule;
        // console.log(newScheduleMin);
        if (oldEndMin <= 0) {
          oldEndHrMin = parseInt("" + oldEndHr + oldEndMin + 0);
        } else {
          oldEndHrMin = parseInt("" + oldEndHr + oldEndMin);
        }
        if (oldStartMin <= 0) {
          oldStartHrMin = parseInt("" + oldStartHr + oldStartMin + 0);
        } else {
          oldStartHrMin = parseInt("" + oldStartHr + oldStartMin);
        }
        if (newScheduleMin <= 0) {
          newSchedule = parseInt("" + newScheduleHr + newScheduleMin + 0);
          console.log("last min check");
          console.log("newSchedule", newSchedule);
        } else {
          newSchedule = parseInt("" + newScheduleHr + newScheduleMin);
        }
        // const oldEndHrMin = parseInt("" + oldEndHr + oldEndMin);
        // const oldStartHrMin = parseInt("" + oldStartHr + oldStartMin);
        // const newSchedule = parseInt("" + newSchduleHr + newSchedule);
        // if (oldEndTime > newSchdueleTime) {
        if (newSchedule >= oldStartHrMin && newSchedule <= oldEndHrMin) {
          // console.log(oldStartHrMin, "<-", newSchedule, "->", oldEndHrMin);
          // console.log("failure");
          result = false;
        } else {
          // console.log(
          //   newSchedule,
          //   ">=",
          //   oldStartHrMin,
          //   "&&",
          //   newSchedule,
          //   "<=",
          //   oldEndHrMin
          // );
          // console.log(
          //   "newScheduleStart",
          //   newSchedule,
          //   " : ",
          //   "oldScheduleHour",
          //   oldEndHrMin
          // );
          // console.log("success");
          result = true;
        }
      });
    }
  }
  // console.log(result);
  if (result) {
    try {
      const pushValue = req.body[theDay];
      console.log("check", theDay);
      console.log("req.body:", req.body[theDay]);
      console.log("push value:", pushValue);
      let psychSchedule = await PsychSchedule.findOneAndUpdate(
        {
          psychSchedule: req.psychiatrist._id,
        },
        {
          $push: {
            [theDay]: pushValue,
            // monday,
            // tuesday,
            // wednesday,
            // thursday,
            // friday,
            // saturday,
            // sunday,
          },
        }
      );
      if (!psychSchedule) {
        // console.log("create stage");
        const psychSchedule = await PsychSchedule.create({
          psychSchedule: req.psychiatrist._id,
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
        });
        const schedule = await psychSchedule.save();
        res.status(200).send(schedule);
      }
      await psychSchedule.save();
      res.status(200).send({ psychSchedule });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(400).json({ msg: "The Date you entered is in between." });
  }
});

router.get("/my-schedule/:date", auth, async (req, res) => {
  try {
    const schedule = await PsychSchedule.findOne({
      psychSchedule: req.psychiatrist._id,
    });
    const todaysSchedule = schedule[req.params.date];
    // console.log(todaysSchedule);
    // if (todaysSchedule.length == 0) {
    //   res.status(400).json({ msg: "No appointment today." });
    //   // res.status(200);
    // } else {
    //   res.status(200).json(todaysSchedule);
    // }
    res.status(200).json(todaysSchedule);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});


router.delete("/my-schedule/:day/:id", auth, async (req, res) => {
  const day = req.params.day;
  const schedule = await PsychSchedule.update(
    {
      psychSchedule: req.psychiatrist._id,
    },
    { $pull: { [day]: { _id: req.params.id } } }
    );
    if (!schedule) {
      res.status(400).json({ msg: "Schedule not found." });
    } else {
      res.status(200).json({ schedule });
    }
  });

router.get("/:id/:day",async(req,res) => {
  const day = req.params.day;
  const psychId = req.params.id
  try {
    const schedule = await PsychSchedule.findOne({psychSchedule:psychId});
    const todaysSchedule = schedule[day];
    res.status(200).json(todaysSchedule)    
  } catch (error) {
    
  }
});

module.exports = router;
