const router = require("express").Router();
const Room = require("../../models/chat-rooms/Room");

router.get("/",async(req,res) => {
    try {
        const room = await Room.find();
        res.json(room);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Interanl server error")
    }
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



