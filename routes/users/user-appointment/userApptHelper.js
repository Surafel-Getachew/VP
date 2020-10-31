const UserAppointment = require("../../../models/User/user-appointment/UserAppointment");
const PsychSchedule = require("../../../models/Psychiatrist/psych-schedule/PsychSchedule");
const PsychAppointment = require("../../../models/Psychiatrist/psych-appointment/PsychAppointment");
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

  let validationResult = {
    info:{},
    value:false
  }
  if (psychSchedule){
    psychSchedule[theDay].forEach(async(schedule) => {
      console.log("Im at this point");
      const apptStartHr = new Date(apptStart).getHours();
      const apptStartMin = new Date(apptStart).getMinutes();
      const apptEndHr = new Date (apptEnd).getHours();
      const apptEndMin = new Date (apptEnd).getMinutes();
      // console.log(apptStartHr);
      // console.log(apptStartMin)
      // console.log(apptEndHr);
      // console.log(apptEndMin)
      console.log(schedule.id);
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
          // console.log("true stage");
          const info = {
            scheduleStartHrMin,
            scheduleEndHrMin,
            scheduleStart:schedule.start,
            scheduleEnd:schedule.end,
            apptStartHrMin,
            apptEndHrMin,
            apptStart:apptStart,
            apptEnd:apptEnd,
            scheduleId:schedule.id,
            theDay:theDay,
            psychSchedule:appointedTo
          }
          // await updatePsychSchedule(info);
          return validationResult = {
            info:info,
            value:true
          };
         
          console.log("validation passed");
        }
      } else {
        console.log("false stage");
        return validationResult = {
          info:info,
          value:false
        };
        console.log("Validation failed");
      }
    })
    return validationResult;
  }
}

const addPsychAppointment = async(info) => {
  const {appointedTo,theDay,startTime,endTime,appointedBy} = info;
  const psychAppt = await PsychAppointment.findOne({
    psychAppointedTo:appointedTo
  });
  if (psychAppt == null){
    const appointment = await PsychAppointment.create({
      psychAppointedTo:appointedTo,
      [theDay]:[{
        start:startTime,
        end:endTime,
        appointedBy:appointedBy
      }
      ]
    });
    await appointment.save();
  } else {
    
    let appointment = await PsychAppointment.findOneAndUpdate(
      {
        psychAppointedTo:appointedTo
      },
      {
        $push : {
          [theDay]:[{
            start:startTime,
            end:endTime,
            appointedBy:appointedBy
          }]
        }
      }
    )
    await appointment.save();
  }
}

const deletePsychSchedule = async(psychSchedule,theDay,scheduleId) => {
  console.log("deletion stage...");
  const schedule = await PsychSchedule.update({
    psychSchedule:psychSchedule
  },{
    $pull:{[theDay]:{_id:scheduleId}}
  });
}
const createPsychSchedule = async(psychId,theDay,start,end) => {
  console.log("adding schedule...");
  console.log("start",start);
  console.log("end",end)
  // const {theDay,startTime,endTime,psychSchedule} = info;
  // console.log("id of the schedule",psychId)
  // const schedule = await PsychSchedule.findOne({
  //   psychSchedule:psychId
  // });
  // if (schedule == null) {
  //   console.log("schedule not found");
  //   const schedule = await PsychSchedule.create({
  //     psychSchedule:psychId,
  //     [theDay]:[
  //       {
  //         start:start,
  //         end:end,
  //       }
  //     ]
  //   });
  //   await schedule.save();
  //   console.log("New schedule created");

  // } else {
    let schedule = await PsychSchedule.findOneAndUpdate(
      {
      psychSchedule:psychId
      },
    {
      $push : {
        [theDay]:[{
          start:start,
          end:end
        }]
      }
    });
    await schedule.save();
    console.log("schedule updated",schedule);
  
  }
// }

const updatePsychSchedule = async(info) => {
  console.log("psych schedule update stage");
  // console.log(info);
  const {scheduleStartHrMin,scheduleEndHrMin,apptStartHrMin,apptEndHrMin,scheduleId,theDay,psychSchedule,scheduleStart,scheduleEnd,apptStart,apptEnd} = info;
  console.log(info);
  if (apptStartHrMin > scheduleStartHrMin && apptStartHrMin < scheduleEndHrMin){
    if (apptEndHrMin>scheduleStartHrMin && apptEndHrMin < scheduleEndHrMin) {
      console.log("In between stage");
      await createPsychSchedule(psychSchedule,theDay,scheduleStart,apptStart);
      await createPsychSchedule(psychSchedule,theDay,apptEnd,scheduleEnd);
      await deletePsychSchedule(psychSchedule,theDay,scheduleId);
      return true;
    }
  } else if (scheduleStartHrMin == apptStartHrMin && apptEndHrMin == scheduleEndHrMin) {
    console.log("schedule and appt equals");  
    await deletePsychSchedule(psychSchedule,theDay,scheduleId);
    return true;
  } else if (apptStartHrMin == scheduleStartHrMin && scheduleStartHrMin < apptEndHrMin <scheduleEndHrMin) {
    console.log("schedule start equals");
    await createPsychSchedule(psychSchedule,theDay,apptEnd,scheduleEnd)  
    await deletePsychSchedule(psychSchedule,theDay,scheduleId);
    return true;  
  } 
  else {
    console.log("schedule end equals");
    await createPsychSchedule(psychSchedule,theDay,scheduleStart,apptStart);
    await deletePsychSchedule(psychSchedule,theDay,scheduleId);
    return true;
  }
}


module.exports = {
  createUserAppt,
  updateUserAppt,
  validateUserAppt,
  validateWithPsychSchedule,
  addPsychAppointment,
  updatePsychSchedule
};
