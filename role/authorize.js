// const expressJwt = require("express-jwt");
// const jwt = require ("jsonwebtoken");
// const config = require("config");
// const Psychiatrist = require("../models/Psychiatrist");
// const authorizePsych = async (req,res,next) => {
//     try {
//         const token = req.header("Authoriztion");
//         const decoded = jwt.verify(token,config.get("jwtSecret"));
//         const psychiatrist = await Psychiatrist.findOne({
//             _id:decoded._id,
//             role:decoded.role,
//         })
//         if()
//     } catch (error) {
        
//     }
// }
