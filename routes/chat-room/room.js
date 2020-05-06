const router = require("express").Router();
const Room = require("../../models/chat-rooms/Room");

router.get("/",async(req,res) => {
    const room = await Room.find();
    res.json({room});
})

router.post("/",async(req,res) => {
    const {name} = req.body;
    const room = new Room ({
        name
    });
    await room.save();
    res.json(room);
})


module.exports = router;



