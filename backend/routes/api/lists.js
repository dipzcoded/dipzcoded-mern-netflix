import express from "express";
import {
  addFilmToListContents,
  createFilmList,
  removeFilmFromListContents,
  getFilmList,
  getListById,
} from "../../controllers/list.js";
import { authMiddleware } from "../../middlewares/auth.js";
const router = express.Router();

router.use(authMiddleware);
router.route("/").get(getFilmList);
router.route("/:id").get(getListById);
router.route("/").post(createFilmList);
router.route("/:id/:filmId/add").patch(addFilmToListContents);
router.route("/:id/:filmId/remove").patch(removeFilmFromListContents);

export default router;
