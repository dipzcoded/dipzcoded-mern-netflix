import jwt from "jsonwebtoken";
import userModel from "../models/User.js";
import asyncHandler from "express-async-handler";
export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userModel.findById(decodedToken.id);
      next();
    } else {
      res.status(401);
      throw new Error("invalid token passed");
    }
  } else {
    res.status(401);
    throw new Error("no token was passed!");
  }
});
