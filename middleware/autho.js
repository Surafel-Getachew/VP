const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");


const autho = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer", "");
    if (!token) {
      return res.status(401).json({msg:"no token,authorization denied"})
    }
    try {
      const decoded = jwt.verify(token, config.get("jwtSecret"));
      const user = await User.findOne({
        _id: decoded._id,
        role:decoded.role,
        "tokens.token": token
      });
      req.user = user
      req.token = token
      next();
    } catch (error) {
      return res.status(401).json({ msg:"Unauthorized bae" });
    }
  
  } catch (error) {
    return res.status(401).json({ msg:"Unauthorized babe" });
  }
};

module.exports = autho;
