import express from "express";
import {
  createFilm,
  deleteFilm,
  getFilms,
  getFilm,
  getRandomFilm,
  updateFilm,
  getAllFilms,
} from "../../controllers/movie.js";
import { authMiddleware } from "../../middlewares/auth.js";
const router = express.Router();

router.use(authMiddleware);
router.route("/random").get(getRandomFilm);
router.route("/:id").get(getFilm);
router.route("/").get(getFilms);
router.route("/all").get(getAllFilms);
router.route("/").post(createFilm);
router.route("/:id").patch(updateFilm).delete(deleteFilm);

export default router;
