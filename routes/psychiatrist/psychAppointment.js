const router = require("express").Router();
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const PsychAppointment = require("../../models/Psychiatrist/psych-appointment/PsychAppointment");
const UserProfile = require("../../models/User/UserProfile/UserProfile")

router.get("/admin/allAppointment",adminAuth,async(req,res) => {
    let totalMonday = 0;
    let totalTuesday = 0;
    let totalWednesday = 0;
    let totalThursday = 0;
    let totalFriday = 0;
    let totalSaturday = 0;
    let totalSunday= 0;
    let days = {monday:"",tuesday:"",wednesday:"",thursday:"",friday:"",saturday:"",sunday:""}

    try {
        const allAppt= await PsychAppointment.find()
        for(let i=0; i<allAppt.length; i++){
            mondayLength = allAppt[i].monday.length;
            totalMonday += mondayLength
            tuesdayLength = allAppt[i].tuesday.length;
            totalTuesday += tuesdayLength
            wednesdayLength = allAppt[i].wednesday.length;
            totalWednesday += wednesdayLength
            thursdayLength = allAppt[i].thursday.length;
            totalThursday += thursdayLength
            fridayLength = allAppt[i].friday.length;
            totalFriday += fridayLength
            saturdayLength = allAppt[i].saturday.length;
            totalSaturday += saturdayLength
            sundayLength = allAppt[i].sunday.length;
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
        res.status(500).json({msg:"Internal Server Error"});
    }
})

router.get("/",auth, async (req,res) => {
    const psychappt = await PsychAppointment.findOne({psychAppointedTo:req.psychiatrist.id});
     if (psychappt == null) {
        console.log("You have no data send smt");
     } else {
         res.status(200).send(psychappt);
     }
});

router.get("/my-appointment/:date",auth,async (req,res) => {
    const psychAppt = await PsychAppointment.findOne({psychAppointedTo:req.psychiatrist._id});
    const todaysAppt = psychAppt[req.params.date]
    res.status(200).json(todaysAppt)
})

router.get("/appointedUserProfile/:date",auth,async(req,res) => {
    const psychAppt = await PsychAppointment.findOne({psychAppointedTo:req.psychiatrist._id});
    const todaysAppt = psychAppt[req.params.date];
    let profile = [];
        for (let i =0; i<todaysAppt.length; i++) {
            const userProfile = await UserProfile.findOne({profileOwner:todaysAppt[i].appointedBy});
            if (userProfile.avatar == undefined) {
                profile.push(userProfile);
            } else {
                const avatar = Buffer.from(userProfile.avatar).toString("base64");
                let cProfile = {
                    name:userProfile.name,
                    avatar:avatar,
                    gender:userProfile.gender
                }
                profile.push(cProfile);
            }
        }
    res.status(200).send(profile);
})

router.get("/totalNumbeOfAppt",auth,async(req,res) => {
    let days = [{name:"monday"},{name:"tuesday"},{name:"wednesday"},{name:"thursday"},{name:"friday"},{name:"saturday"},{name:"sunday"},]
    let totalAppt = 0;
    try {
        const appt = await PsychAppointment.findOne({psychAppointedTo:req.psychiatrist._id});
        for(let i = 0;i<days.length;i++){
            let name = days[i].name
            totalAppt = totalAppt + appt[name].length
        }
        res.status(200).send(totalAppt.toString())
    } catch (error) {
        res.status(500).json({msg:"Internal Server Error"});
        console.log(error.message);
    }
})

module.exports = router;