import asyncHandler from "express-async-handler";
import userModel from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  checkUserLogin,
  removeUserRefreshTokens,
  checkTokenAvaliable,
} from "../utlis/auth.js";
import jwt from "jsonwebtoken";
// create user account
export const register = asyncHandler(async (req, res) => {
  let user;
  const { userName, email, password } = req.body;
  user = await userModel.findOne({ username: userName });

  if (user) {
    res.status(403);
    throw new Error("User already exist with such username");
  }

  user = await userModel.findOne({ email });
  if (user) {
    res.status(403);
    throw new Error("User already exist with that email");
  }

  user = await userModel.create({
    username: userName,
    email,
    password,
  });

  res.json({
    status: "success",
    msg: "register successfully!",
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  let user;

  user = await userModel.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid Credentails");
  }

  if (!(await checkUserLogin(user._id))) {
    res.json({
      status: "success",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        isAdmin: user.isAdmin,
      },
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    });
  } else {
    res.status(403);
    throw new Error("user already logged in");
  }
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (
    refreshToken &&
    String(jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET).id) ===
      String(req.user._id)
  ) {
    if (
      (await checkUserLogin(req.user._id)) &&
      (await checkTokenAvaliable(refreshToken))
    ) {
      removeUserRefreshTokens(refreshToken);
      return res.json({
        status: "success",
        msg: "refresh token deleted succesfully",
      });
    } else {
      res.status(403);
      throw new Error(
        "you need to be logged in before you can perform this func or token invalid"
      );
    }
  } else {
    res.status(404);
    throw new Error(
      "refresh token not valid or not passed as data to the body"
    );
  }
});

export const newRefreshTokenGen = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    const user = String(
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET).id
    );

    if (
      (await checkUserLogin(user)) &&
      (await checkTokenAvaliable(refreshToken))
    ) {
      removeUserRefreshTokens(refreshToken);

      return res.json({
        status: "success",
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
      });
    } else {
      res.status(403);
      throw new Error(
        "you need to be logged in before you can perform this func or token invalid"
      );
    }
  } else {
    res.status(404);
    throw new Error(
      "refresh token not valid or not passed as data to the body"
    );
  }
});
