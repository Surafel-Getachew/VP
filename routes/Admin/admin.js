const express = require("express");
const router = express.Router();
// const passport = require("passport");
const bcrypt = require("bcryptjs");
const adminAuth = require("../../middleware/adminAuth");
const Admin = require("../../models/Admin/Admin");

router.post("/signup",async(req,res) => {
    try {
        const {name,email,password} = req.body;
        let admin = await Admin.findOne({email});
        if (admin) {
            res.status(400).json({msg:"Admin already exist"})
        } else {
            admin = new Admin({
                name,
                email,
                password
            });
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(password,salt);
            await admin.save();
            const token = await admin.generateAuthToken();
            res.status(201).send({ token,msg:"Registered Succesfuly" }); // i removed sending the psychiatrist.
        }
    } catch (error) {
        
    }
});

router.post("/signin",async (req,res) => {
    try {
        const {email,password} = req.body
        const admin = await Admin.findOne({email:email});
        if(!admin) {
            return res.status(400).json({msg:"Admin doesn't exist"})
        } 
        const isMatch = await bcrypt.compare(password,admin.password);
        if (!isMatch) {
            return res.status(400).json({msg:"Invalid Credentials"})
        }
        const token = await admin.generateAuthToken();
        res.status(200).send({admin,token})
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error")
    }
});

router.get("/",adminAuth,async(req,res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select("-password");
        res.json(admin)
    } catch (error) {
        res.status(500).send(error.message)
    }
})


module.exports = router;
