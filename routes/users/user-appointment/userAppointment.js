const router = require("express").Router();
const auth = require("../../../middleware/autho");
const UserAppointment = require("../../../models/User/user-appointment/UserAppointment");
router.get("/", auth, (req, res) => {
    // res.send("user appointment router")
    res.send(req.user);
});

router.post("/", auth, async (req, res) => {
    const { psychId, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body;
    // let theDay;
    // for (const day in req.body) {
    //     theDay = day;
    //     console.log()
    // }
    // const startTime = req.body[theDay][0].start;
    // const endTime = req.body[theDay][0].end;
    // const userAppointed = req.user._id;
    try {
        const userAppt = await UserAppointment.create({
            userAppointed: req.user._id,
            monday,
            tuesday,
        });
        await userAppt.save()
        res.status(200).send({ userAppt });
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
})


module.exports = router;