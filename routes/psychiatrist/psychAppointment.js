const router = require("express").Router();
const auth = require("../../middleware/auth");
const PsychAppointment = require("../../models/Psychiatrist/psych-appointment/PsychAppointment");

router.get("/",auth, async (req,res) => {
    const psychappt = await PsychAppointment.findOne({psychAppointedTo:req.psychiatrist.id});
     if (psychappt == null) {
        console.log("You have no data send smt");
     } else {
         res.status(200).send(psychappt);
     }
});

module.exports = router;