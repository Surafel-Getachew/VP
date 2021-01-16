const { response } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../../middleware/auth");
const autho = require("../../middleware/autho");
const adminAuth = require("../../middleware/adminAuth")
const GroupVideoChat = require("../../models/GroupVideoChat/GroupVideoChat");

var upload = multer({});

router.get("/all",autho,async(req,res) => {
    try {
        let allRooms = []
        const rooms = await GroupVideoChat.find({});
        rooms.forEach((room) => {
            let avi = Buffer.from(room.avatar).toString("base64");
            let roomData = {
                ...room._doc,
                avatar:avi
            }
            allRooms.push(roomData)
        })
        res.status(200).send(allRooms)
    } catch (error) {
        res.status(500).json({msg:"Internal Server Error"});
    }
});

router.post("/psychiatrist/search",auth,async(req,res) => {
    const {
      searchText
    } = req.body
    try {
        let allRooms = []
      const rooms = await GroupVideoChat.find({roomOwner:req.psychiatrist._id,$text: {$search:searchText}});
      rooms.forEach((room) => {
          let avi = Buffer.from(room.avatar).toString("base64");
            let roomData = {
                ...room._doc,
                avatar:avi
            }
            allRooms.push(roomData)
        })
      res.status(200).send(allRooms);
    } catch (error) {
      res.status(500).send({msg:"Internal Server Error"})
      console.log(error.message);
    }
  })

router.post("/search/all",async(req,res) => {
    const {searchText} = req.body
    try {
        let listOfRooms = []
        const rooms = await GroupVideoChat.find({$text:{$search:searchText}});
        rooms.forEach((room) => {
            let avatar = Buffer.from(room.avatar).toString("base64")
            let group = {
                ...room._doc,
                avatar:avatar
            }
            listOfRooms.push(group);
        })
        res.status(200).send(listOfRooms);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({msg:"Server Error"});
    }
})

router.post("/category",async(req,res) => {
    const {category} = req.body
    try {
        let allRooms = [];
        const rooms = await GroupVideoChat.find({category:category});
        rooms.forEach((room) => {
            let avi = Buffer.from(room.avatar).toString("base64");
            let roomData = {
                ...room._doc,
                avatar:avi
            }
            allRooms.push(roomData)
        })
        res.status(200).send(allRooms);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg:"Internal Server Error"});
    }
})

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
            category:category,
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
        let psychRoom = []
        const myRooms = await GroupVideoChat.find({roomOwner:req.psychiatrist._id});
        myRooms.forEach((room) => {
            let avatar = Buffer.from(room.avatar).toString("base64")
            let group = {
                ...room._doc,
                avatar:avatar
            }
            psychRoom.push(group);
        })
        res.status(200).send(psychRoom);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg:"Internal Server Error"});
    }
});


router.delete("/:id",auth,async(req,res) => {
    try {
        const room = await GroupVideoChat.findOne({_id:req.params.id})
        // const room = await GroupVideoChat.findOneAndDelete({roomOwner:req.psychiatrist.id,});
        if (!room) {
            return res.status(400).json({msg:"Room Not Found"});
        } else {
            const deleteRoom = await GroupVideoChat.findOneAndDelete({_id:req.params.id})
            return res.status(200).json({msg:"Room Deleted"})
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({msg:"Internal Server Error"})
    }
});

router.delete("/admin/:id",adminAuth,async(req,res) => {
    try {
        const room = await GroupVideoChat.findOne({_id:req.params.id})
        // const room = await GroupVideoChat.findOneAndDelete({roomOwner:req.psychiatrist.id,});
        if (!room) {
            return res.status(400).json({msg:"Room Not Found"});
        } else {
            const deleteRoom = await GroupVideoChat.findOneAndDelete({_id:req.params.id})
            return res.status(200).json({msg:"Room Deleted"})
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({msg:"Internal Server Error"})
    }
});

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

module.exports = router;
