import express from "express";
import {
  addFilmToListContents,
  createFilmList,
  removeFilmFromListContents,
  getFilmList,
} from "../../controllers/list.js";
import { authMiddleware } from "../../middlewares/auth.js";
const router = express.Router();
router.route("/").get(getFilmList);
router.use(authMiddleware);
router.route("/").post(createFilmList);
router.route("/:id/:filmId/add").patch(addFilmToListContents);
router.route("/:id/:filmId/remove").patch(removeFilmFromListContents);

export default router;
