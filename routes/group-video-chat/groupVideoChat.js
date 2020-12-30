const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../../middleware/auth");
const GroupVideoChat = require("../../models/GroupVideoChat/GroupVideoChat");

var upload = multer({});

router.get("/",(req,res) => {
    res.send("groupVideoChat")
});

module.exports = router;

router.post("/createGroup",upload.single("avatar"),auth,async(req,res) => {
    try {
        const {
            name,
            start,
            end,
            description,
            category
        } = req.body;
        // const groupPhoto = Buffer.from(photo).toString("base64")
        const room = await GroupVideoChat.create({
            name:name,
            start:start,
            end:end,
            description:description,
            catagery:category,
            avatar:req.file.buffer,
            roomOwner:req.psychiatrist._id
        });
        await room.save();
        res.status(200).json({room});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error")
    }
});

router.get("/myRooms",auth,async(req,res) => {
    try {
        const myRooms = await GroupVideoChat.find({roomOwner:req.psychiatrist._id});
        res.status(200).send(myRooms);
    } catch (error) {
        res.status(500).json({msg:"Internal Server Error"});
    }
})

router.post("/avatar",upload.single("avatar"),auth,async(req,res) => {
    const room = {
        avatar:req.file.buffer
    }
    try {
        let roomProfile = await GroupVideoChat.findOneAndUpdate(
            {roomOwner:req.psychiatrist._id},
            {$set:room},
            { new: true, upsert: true }
        );
        await roomProfile.save();
        res.status(201).json(roomProfile)
    } catch (error) {
        res.status(500).send(error);
        console.log(error.message);
    }
})