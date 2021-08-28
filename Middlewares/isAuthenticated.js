//Servira pour la route favorite

const User = require("../Models/User");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    }).select("_id account token");
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      req.user = user;
      return next();
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
