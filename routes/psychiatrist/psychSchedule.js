const router = require("express").Router();
const moment = require("moment");
const auth = require("../../middleware/auth");
const PsychSchedule = require("../../models/PsychSchedule");
const { modelName } = require("../../models/PsychSchedule");

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
    // console.log("req.body",days);
    theDay = day;
  }
  const newStartTime = req.body[theDay][0].start;
  console.log("req.ps", req.psychiatrist._id);
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
      console.log("the second schedule of the day:", schedules[theDay]);
      schedules[theDay].forEach((schedule) => {
        const oldEndHr = new Date(schedule.end).getHours();
        const oldEndMin = new Date(schedule.end).getMinutes();
        const oldStartHr = new Date(schedule.start).getHours();
        const oldStartMin = new Date(schedule.start).getMinutes();
        const newSchdueleHr = new Date(newStartTime).getHours();
        const newSchdueleMin = new Date(newStartTime).getMinutes();
        const oldEndHrMin = parseInt("" + oldEndHr + oldEndMin);
        const oldStartHrMin = parseInt("" + oldStartHr + oldStartMin);
        const newSchedule = parseInt("" + newSchdueleHr + newSchdueleMin);
        // if (oldEndTime > newSchdueleTime) {
        if (newSchedule >= oldStartHrMin && newSchedule <= oldEndHrMin) {
          console.log(oldStartHrMin, "<-", newSchedule, "->", oldEndHrMin);
          console.log("failure");
          result = false;
        } else {
          console.log(
            "newScheduleStart",
            newSchedule,
            " : ",
            "oldScheduleHour",
            oldEndHrMin
          );
          console.log("success");
          result = true;
        }
      });
    }
  }
  console.log(result);
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
        console.log("create stage");
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
    console.log(todaysSchedule);
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

module.exports = router;
