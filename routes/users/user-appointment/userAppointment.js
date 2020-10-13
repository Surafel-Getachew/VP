const router = require("express").Router();
const auth = require("../../../middleware/autho");
const UserAppointment = require("../../../models/User/user-appointment/UserAppointment");
router.get("/",auth,(req,res) => {
    // res.send("user appointment router")
    res.send(req.user);
});

router.post("/",auth,(req,res) => {
    const {} = req.body
})


module.exports = router;