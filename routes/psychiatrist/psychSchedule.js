const router = require("express").Router();
const moment = require("moment");
const auth = require("../../middleware/auth");
const PsychSchedule = require("../../models/PsychSchedule");
router.get("/", async (req, res) => {
  // const psychData = await PsychSchedule.findOne({
  //   psychSchedule: "5f5739c8f617f54354338ee5",
  // });
  // const {monday} = req.body;
  // psychData.monday.forEach((psych) => {
  //   const oldEndTime = new Date(psych.end).getHours();
  //   const newStartTime = new Date(monday.start).getHours();
  //   if (newStartTime < oldEndTime){
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
const validateSchedule = async (id, newTime) => {
  const schedules = await PsychSchedule.findOne({ psychSchedule: id });
  const newStartTime = new Date(newTime).getHours();
  console.log("id", id);
  // await Promise.all(
  schedules.monday.forEach((schedule) => {
    const oldEndTime = new Date(schedule.end).getHours();

    console.log("new Time", newStartTime);
    console.log("old time", oldEndTime);
    if (newStartTime < oldEndTime) {
      console.log("Failure");
      return false;
    } else {
      console.log("Success");
      return true;
    }
  });
  // );
};

let validationResult;

const validateDate = async (id, newTime) => {
  const newScheduleStart = new Date(newTime).getHours();
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
  const newTime = req.body.monday[0].start;
  console.log("req.body", req.body.monday[0].start);
  console.log("req.ps", req.psychiatrist._id);
  let result;
  const schedules = await PsychSchedule.findOne({
    psychSchedule: req.psychiatrist._id,
  });

  if (schedules == null) {
    result = true;
  } else {
     schedules.monday.forEach((schedule) => {
      const endTime = new Date(schedule.end).getHours();
      const newSchdueleTime = new Date(newTime).getHours();
      if (endTime > newSchdueleTime) {
        console.log(
          "newScheduleStart",
          newSchdueleTime,
          " : ",
          "oldScheduleHour",
          endTime
        );
        console.log("failure");
        result = false;
      } else {
        console.log(
          "newScheduleStart",
          newSchdueleTime,
          " : ",
          "oldScheduleHour",
          endTime
        );
        console.log("success");
        result = true;
      }
    });
  }

  // const validation = validateDate(req.psychiatrist._id, newTime);
  // console.log("validation result", validation);
  console.log(result);
  if (result) {
    try {
      let psychSchedule = await PsychSchedule.findOneAndUpdate(
        {
          psychSchedule: req.psychiatrist._id,
        },
        {
          $push: {
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
          },
        }
      );
      if (!psychSchedule) {
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
    res.status(400).send("Invalid date");
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
