import asyncHandler from "express-async-handler";
import userModel from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  checkUserLogin,
  removeUserRefreshTokens,
} from "../utlis/auth.js";

// create user account
export const register = asyncHandler(async (req, res) => {
  let user;
  const { username, email, password } = req.body;
  user = await userModel.findOne({ username });

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
    username,
    email,
    password,
  });

  res.json({
    status: "success",
    user: {
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      isAdmin: user.isAdmin,
    },
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
  if (await checkUserLogin(req.user._id)) {
    removeUserRefreshTokens(req.user._id);
    res.json({
      status: "success",
      msg: "refresh token deleted succesfully",
    });
  } else {
    res.status(403);
    throw new Error("cant remove token when u have not logged in yet");
  }
});
