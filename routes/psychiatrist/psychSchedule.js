const router = require("express").Router();
const moment = require("moment");
const auth = require("../../middleware/auth");
const PsychSchedule = require("../../models/PsychSchedule");
const { modelName } = require("../../models/PsychSchedule");
router.get("/", async (req, res) => {
  // const psychData = await PsychSchedule.findOne({
  //   psychSchedule: "5f5739c8f617f54354338ee5",

  // });
  const psychData = await PsychSchedule.findOne({
    psychSchedule: "5f5739c8f617f54354338ee5",
  });
  res.send(psychData.monday);
  // const {monday} = req.body;
  // psychData.monday.forEach((psych) => {
  //   const oldoldEndTime = new Date(psych.end).getHours();
  //   const newStartTime = new Date(monday.start).getHours();
  //   if (newStartTime < oldoldEndTime){
  //     return res.status(401).send("Invalid Date")
  //   }
  //     PsychSchedule.create({
  //       psychSchedule:"5f5739c8f617f54354338ee5",
  //       monday
  //     }).then((schedule,error) => {
  //       schedule.save();
  //      res.status(200).send(schedule)
  //     });
  //   // console.log(time.getHours());
  // });
});
// const validateSchedule = async (id, newStartTime) => {
//   const schedules = await PsychSchedule.findOne({ psychSchedule: id });
//   const newStartTime = new Date(newStartTime).getHours();
//   console.log("id", id);
//   // await Promise.all(
//   schedules.monday.forEach((schedule) => {
//     const oldoldEndTime = new Date(schedule.end).getHours();

//     console.log("new Time", newStartTime);
//     console.log("old time", oldoldEndTime);
//     if (newStartTime < oldoldEndTime) {
//       console.log("Failure");
//       return false;
//     } else {
//       console.log("Success");
//       return true;
//     }
//   });
//   // );
// };

let validationResult;

const validateDate = async (id, newStartTime) => {
  const newScheduleStart = new Date(newStartTime).getHours();
  const oldScheduleEnd = await PsychSchedule.findOne({ psychSchedule: id });
  if (oldScheduleEnd) {
    console.log("theres is in the db");
    oldScheduleEnd.monday.forEach((schedule) => {
      const oldScheduleHour = new Date(schedule.end).getHours();
      if (newScheduleStart < oldScheduleHour) {
        console.log(
          "newScheduleStart",
          newScheduleStart,
          " : ",
          "oldScheduleHour",
          oldScheduleHour
        );
        // console.log("failed")
        return false;
        // validationResult = "failed"
      } else {
        // console.log("success")
        console.log(
          "newScheduleStart",
          newScheduleStart,
          " : ",
          "oldScheduleHour",
          oldScheduleHour
        );
        return true;
        // validationResult = "success"
      }
    });
  } else {
    // validationResult = "success"
    // console.log("ntn in db");
    return true;
  }
};

// validateSchedule();
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

  if (schedules == null) {
    result = true;
  } else {
    if (schedules[theDay] == null) {
      console.log("schedules.theday stage");
      result = true;
    } else {
      schedules[theDay].forEach((schedule) => {
        const oldEndTime = new Date(schedule.end).getHours();
        const oldStartTime = new Date(schedule.start).getHours();
        const newSchdueleTime = new Date(newStartTime).getHours();
        // if (oldEndTime > newSchdueleTime) {
        if (newSchdueleTime > oldStartTime && newSchdueleTime < oldEndTime) {
          console.log(oldStartTime, "<-", newSchdueleTime, "->", oldEndTime);
          console.log("failure");
          result = false;
        } else {
          console.log(
            "newScheduleStart",
            newSchdueleTime,
            " : ",
            "oldScheduleHour",
            oldEndTime
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

router.post("/add", auth, async (req, res) => {
  const { monday } = req.body;
  try {
    const schedule = await PsychSchedule.create({
      monday,
    });
  } catch (error) {}
});

module.exports = router;

// {
//     "monday":[
//         {
//             "start":"2020-09-26T08:00:00.860+00:00",
//             "end":"2020-09-26T10:00:00.480+00:00"
//         }
//     ]
// }
