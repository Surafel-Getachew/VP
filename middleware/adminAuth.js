const jwt = require("jsonwebtoken");
const config = require("config");
const Admin = require("../models/Admin/Admin");

module.exports = async function (req,res,next) {
    const token = req.header("Authorization");
    if(!token) {
        return res.status(401).json({err:"No token, access denied"});
    } else {
        try {
            const decoded = jwt.verify(token,config.get("jwtSecret"));
            const admin = await Admin.findOne({
                _id:decoded._id,
                "tokens.token":token,
            });
            req.admin = admin,
            req.token = token
            next();
        } catch (error) {
            res.status(401).send({msg:"Unauthorized Access"});
        }
    }
}