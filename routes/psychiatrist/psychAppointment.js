const router = require("express").Router();
const auth = require("../../middleware/auth");
const PsychAppointment = require("../../models/Psychiatrist/psych-appointment/PsychAppointment");
const UserProfile = require("../../models/User/UserProfile/UserProfile")
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

module.exports = router;