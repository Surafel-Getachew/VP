const UserAppointment = require("../../../models/User/user-appointment/UserAppointment");
const PsychSchedule = require("../../../models/Psychiatrist/psych-schedule/PsychSchedule");
const createUserAppt = async (userAppointedId, reqBody) => {
  const {
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  } = reqBody;
  const userAppt = await UserAppointment.create({
    userAppointed: userAppointedId,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  });
  await userAppt.save();
  return true;
};

const updateUserAppt = async (userAppointedId, theDay, pushValue) => {
  let appointment = await UserAppointment.findOneAndUpdate(
    {
      userAppointed: userAppointedId,
    },
    {
      $push: {
        [theDay]: pushValue,
      },
    }
  );
  await appointment.save();
  return true;
};

const validateUserAppt = async (info) => {
  const { userAppointedId, theDay, newStartTime } = info;
  const userAppt = await UserAppointment.findOne({
    userAppointed: userAppointedId,
  });
  let validationResult
  userAppt[theDay].forEach((appt) => {
    const oldStartHr = new Date(appt.start).getHours();
    const oldStartMin = new Date(appt.start).getMinutes();
    const oldEndHr = new Date(appt.end).getHours();
    const oldEndMin = new Date(appt.end).getMinutes();
    const newScheduleHr = new Date(newStartTime).getHours();
    const newScheduleMin = new Date(newStartTime).getMinutes();
    let oldStartHrMin;
    let oldEndHrMin;
    let newSchedule;
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
    } else {
      newSchedule = parseInt("" + newScheduleHr + newScheduleMin);
    }
    if (newSchedule >= oldStartHrMin && newSchedule <= oldEndHrMin) {
      // console.log("false stage");
      validationResult = false;
    } else {
      // console.log("true stage");
      validationResult = true;
    }
  });
  return validationResult
};

const validateWithPsychSchedule = async(info) => {
  const {appointedTo,theDay,apptStart,apptEnd} = info
  const psychSchedule = await PsychSchedule.findOne({
    psychSchedule:appointedTo
  });
  let validationResult = false
  if (psychSchedule){
    psychSchedule[theDay].some((schedule) => {
      console.log("Im at this point");
      const apptStartHr = new Date(apptStart).getHours();
      const apptStartMin = new Date(apptStart).getMinutes();
      const apptEndHr = new Date (apptEnd).getHours();
      const apptEndMin = new Date (apptEnd).getMinutes();
      // console.log(apptStartHr);
      // console.log(apptStartMin)
      // console.log(apptEndHr);
      // console.log(apptEndMin)

      const scheduleStartHr = new Date(schedule.start).getHours();
      const scheduleStartMin = new Date(schedule.start).getMinutes();
      const scheduleEndHr = new Date(schedule.end).getHours();
      const scheduleEndMin = new Date(schedule.end).getMinutes();
      // console.log(scheduleEndHr);
      // console.log(scheduleEndMin);

      let scheduleStartHrMin;
      let scheduleEndHrMin;
      let apptStartHrMin;
      let apptEndHrMin;
      if (scheduleStartMin <= 0) {
        scheduleStartHrMin = parseInt ("" + scheduleStartHr + scheduleStartMin + 0);
      } else {
        scheduleStartHrMin = parseInt ("" + scheduleStartHr + scheduleStartMin)
      }
      if (scheduleEndMin <= 0) {
        scheduleEndHrMin = parseInt ("" + scheduleEndHr + scheduleEndMin + 0);
      } else {
        scheduleEndHrMin = parseInt ("" + scheduleEndHr + scheduleEndMin)
      }

      if (apptStartMin <= 0){
        apptStartHrMin = parseInt ("" + apptStartHr + apptStartMin + 0)
      } else {
        apptStartHrMin = parseInt("" + apptStartHr + apptStartMin)
      }
      
      if (apptEndMin <= 0){
        apptEndHrMin = parseInt ("" + apptEndHr + apptEndMin + 0)
      } else {
        apptEndHrMin = parseInt("" + apptEndHr + apptEndMin)
      }
      // console.log(scheduleStartHrMin)
      // console.log(scheduleEndHrMin)
      // console.log(apptStartHrMin);
      // console.log(apptEndHrMin);
      // console.log("apptStart",apptStartHrMin);
      // console.log("apptEnd",apptEndHrMin);
      if (apptStartHrMin >= scheduleStartHrMin && apptStartHrMin <= scheduleEndHrMin) {
        if (apptEndHrMin >= scheduleStartHrMin && apptEndHrMin <= scheduleEndHrMin){
          return validationResult = true;
          console.log("validation passed");
        }
      } else {
        return validationResult = false;
        console.log("Validation failed");
      }
    })
    return validationResult;
  }
}

module.exports = {
  createUserAppt,
  updateUserAppt,
  validateUserAppt,
  validateWithPsychSchedule
};
