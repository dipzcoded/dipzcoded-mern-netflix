import express from "express";

import {
  updateUser,
  deleteUser,
  getAllUsers,
  getMonthlyUserStats,
  getUserById,
} from "../../controllers/user.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();
router.use(authMiddleware);
router.route("/").get(getAllUsers);
router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);
router.route("/monthly/stats").get(getMonthlyUserStats);

export default router;
