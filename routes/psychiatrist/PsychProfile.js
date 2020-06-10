const router = require("express").Router();
const PsychProfile = require("../../models/PsychProfile")
const Psychiatrist = require("../../models/Psychiatrist");
const auth = require("../../middleware/auth");
const multer = require("multer");

router.post("/",auth,async(req,res) => {
    
    const { basicInformation,about,contactDetails,services,specialization,education,experience,awards,memberships} = req.body

    try {
       const psychProfile = new PsychProfile({
            GraduatedFrom,
            work_experience,
            specialization,
            owner: req.psychiatrist._id
        })

        await psychProfile.save();
        res.status(201).json({psychProfile});

    } catch (error) {
        res.status(500).send(error);
        console.error(error.message);
    }
})

router.get("/",(req,res) => {
    try {
        const profile = PsychProfile.find();
        res.json({profile});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})


module.exports = router;