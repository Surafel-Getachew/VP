const UserAppointment = require("../../../models/User/user-appointment/UserAppointment");
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
    console.log(oldStartHrMin < newSchedule < oldEndHrMin);
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

module.exports = {
  createUserAppt,
  updateUserAppt,
  validateUserAppt,
};
