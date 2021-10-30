import userModel from "../models/User.js";
import asyncHandler from "express-async-handler";

export const updateUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const { password, email, isAdmin, username } = req.body;
  if (String(userId) === String(req.user._id) || req.user.isAdmin) {
    const user = await userModel.findById(req.user._id);
    if (username) {
      user.username = username;
    }
    if (password) {
      user.password = password;
    }

    if (email) {
      user.email = email;
    }

    if (isAdmin) {
      user.isAdmin = isAdmin;
    }

    const updatedUser = await user.save();
    res.json({
      status: "success",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } else {
    res.status(403);
    throw new Error("You can only update your account only!");
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;

  if (String(userId) === String(req.user._id) || req.user.isAdmin) {
    const user = await userModel.findById(userId);
    if (user) {
      await userModel.findByIdAndDelete(user._id);
      return res.json({
        status: "success",
        msg: "deleted successful!",
      });
    } else {
      res.status(404);
      throw new Error("user not found!");
    }
  } else {
    res.status(403);
    throw new Error("You can only update your account only!");
  }
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  if (req.user.isAdmin) {
    const user = await userModel.findById(userId);
    if (user) {
      return res.json({
        status: "success",
        user,
      });
    } else {
      res.status(403);
      throw new Error("user not found!");
    }
  } else {
    res.status(403);
    throw new Error("only an admin can perform this function!");
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const { new: sortNew } = req.query;

  if (req.user.isAdmin) {
    const users = sortNew
      ? await userModel.find().sort("-createdAt").limit(10)
      : await userModel.find();
    res.json({
      status: "success",
      results: users.length,
      users,
    });
  } else {
    res.status(403);
    throw new Error("only an admin can perform this function!");
  }
});

export const getMonthlyUserStats = asyncHandler(async (req, res) => {
  const today = new Date();
  const lastYear = today.getFullYear() - 1;
  const monthsArray = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const statsData = await userModel.aggregate([
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 },
      },
    },
  ]);

  const formatStatsData = statsData.map((el) => {
    return {
      ...el,
      _id: monthsArray[el._id - 1],
    };
  });
  res.json({
    status: "success",
    statsData: formatStatsData,
  });
});
