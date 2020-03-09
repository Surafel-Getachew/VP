const jwt = require("jsonwebtoken");
const config = require("config");
const Psychiatrist = require("../models/Psychiatrist");

module.exports = async function(req,res,next){
    const token = req.header("Authorization");
    if (!token){
        return res.status(401).json({err:"No token,access denied"});
    }else{
        try {
            const decoded = jwt.verify(token,config.get("jwtSecret"));
            const psychiatrist = await Psychiatrist.findOne({
                _id:decoded._id,
                "tokens.token":token,
                role:decoded.role
            });
            req.psychiatrist = psychiatrist
            req.token = token,
            req.role = psychiatrist.role
            next();
        } catch (error) {
            res.status(401).json({msg:"Token is not valid"});
        }
    }
}