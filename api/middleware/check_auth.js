require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //accesses the token from the headers.Format :- Bearer <auth-token>
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); //verify the auth token
    req.userData = decoded; // now set the userData with this token and in we can use this to verify
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
