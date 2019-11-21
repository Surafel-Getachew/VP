const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
const autho = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer", "");
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });
    if (!user) {
      throw new Error();
    }
    req.user = user
    req.token = token
    next();
  } catch (error) {
    res.status(401).send({ error });
  }
};

module.exports = autho;
