const router = require("express").Router();
const multer = require("multer");
const UserProfile = require("../../../models/User/UserProfile/UserProfile");
const autho = require("../../../middleware/autho");
var upload = multer({

});

router.get("/me",autho,async(req,res) => {
    // res.send("User Profile");
    const profile = await UserProfile.findOne({profileOwner:req.user._id})
    if(!profile) {
        return res.status(400).json({msg:"Profile Not Found"});
    } else {
        if (profile.avatar !== null){
            let userProfile = {}
            let avatar = Buffer.from(profile.avatar).toString("base64");
            userProfile = {
                name:profile.name,
                gender:profile.gender,
                avatar:avatar
            }
            return res.status(200).send(userProfile);
        } else {
            return res.status(500).send("Internal Server Error");
        }
    }
})

router.post("/",upload.single("avatar"),autho,async(req,res) => {
    let pic = req.file !== undefined ? true : false
    const {
        name,
        gender
    } = req.body
    let userProfile = {}
    if (pic) {
        userProfile = {
            name,
            gender,
            avatar:req.file.buffer
        }
    } else {
         userProfile = {
            name,
            gender,
            // avatar:req.file.buffer
        }
    }

    try {
        let profile  = await UserProfile.findOneAndUpdate({
            profileOwner:req.user._id,
        },{$set:userProfile},
        {new:true,upsert:true});
        await profile.save();
        res.status(201).json(profile)
    } catch (error) {
        res.status(500).json({msg:"Internal Server Error"});
        console.log(error.message);
    }
});

module.exports = router;