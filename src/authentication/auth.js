const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const validation = require('../validations/valid');
const { secretLoginKey } = require('../../config');

// checking authentication
const authentication = async function (req, res, next) {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      res.status(401).send({ status: false, message: "Please log in first" });
    } else {
      // Extracting the token from the "Bearer" scheme
      token = token.replace("Bearer ", "");

      const decodedToken = jwt.verify(
        token,
        secretLoginKey,
        (err, decoded) => {
          if (err) {
            return res.status(401).send({ status: false, message: "Authentication failed" });
          }
          
          // Assign the decoded token to the variable
          return decoded;
        }
      );  

      req.decodedToken = decodedToken;
      next();
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// checking the authorization by userId
const authorization = async function (req, res, next) {
  try {
    const userId = req.params.userId;
    if (!validation.isValidObjectId(userId)) {
      return res.status(401).send({ status: false, message: "Please enter a valid user ID" });
    }
    const uid = await userModel.findOne({ _id: userId }).select({ _id: 0, userId: 1 });
    const decId = req.decodedToken.userId;
    if (decId == uid.userId) {
      next();
    } else {
      return res.status(403).send({ status: false, message: "You are not authorized" });
    }
  } catch (err) {
    res.status(401).send({ status: false, message: "Invalid objectId" });
  }
};
module.exports = { authentication, authorization };
