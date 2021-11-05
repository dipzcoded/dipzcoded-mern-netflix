import express from "express";
// conrtollers
import {
  register,
  login,
  logout,
  newRefreshTokenGen,
} from "../../controllers/auth.js";
import { authMiddleware } from "../../middlewares/auth.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/newrefreshtoken").patch(newRefreshTokenGen);
router.use(authMiddleware);
router.route("/logout").post(logout);
export default router;
