import asyncHanlder from "express-async-handler";
import movieModel from "../models/Movie.js";

export const getFilms = asyncHanlder(async (req, res) => {
  const { type } = req.query;
  if (req.user.isAdmin) {
    const films =
      type && type === "series"
        ? await movieModel.find({ isSeries: { $eq: true } })
        : await movieModel.find({ isSeries: { $ne: true } });
    res.json({
      status: "success",
      results: films.length,
      films: films.reverse(),
    });
  } else {
    res.status(403);
    throw new Error("only an admin can perform this function!");
  }
});

export const getAllFilms = asyncHanlder(async (req, res) => {
  if (req.user.isAdmin) {
    const films = await movieModel.find();
    res.json({
      status: "success",
      results: films.length,
      films: films.reverse(),
    });
  } else {
    res.status(403);
    throw new Error("only an admin can perform this function!");
  }
});

// get Random movies
export const getRandomFilm = asyncHanlder(async (req, res) => {
  let randNum;
  const { type } = req.query;
  const totalMovies = await movieModel.countDocuments();
  if (totalMovies > 0) {
    const films =
      type && type === "series"
        ? await movieModel.find({ isSeries: { $eq: true } })
        : await movieModel.find({ isSeries: { $ne: true } });
    randNum = Math.floor(Math.random() * films.length);
    const film = films.find((film, indexes) => indexes === randNum);
    console.log(film, randNum, films.length);
    res.json({
      status: "success",
      film,
    });
  } else {
    res.status(400);
    throw new Error(
      "cant fetch an empty documents from the database..add data"
    );
  }
});

// get movie by id
export const getFilm = asyncHanlder(async (req, res) => {
  const { id: filmId } = req.params;

  if (filmId) {
    let film = await movieModel.findById(filmId);
    if (film) {
      return res.json({
        status: "success",
        film,
      });
    } else {
      res.status(404);
      throw new Error("film not found!");
    }
  } else {
    res.status(400);
    throw new Error("Invalid Id or id not passed as paramater in the url");
  }
});

// create movies
export const createFilm = asyncHanlder(async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = await movieModel.create({ ...req.body });
    res.status(201);
    res.json({
      status: "success",
      movie: newMovie,
    });
  } else {
    res.status(403);
    throw new Error("only an admin can perform this function!");
  }
});

// update movie by id
export const updateFilm = asyncHanlder(async (req, res) => {
  const { id: filmId } = req.params;

  if (req.user.isAdmin) {
    if (filmId) {
      let movie = await movieModel.findById(filmId);
      if (movie) {
        movie = await movieModel.findByIdAndUpdate(
          movie._id,
          {
            $set: req.body,
          },
          { new: true }
        );
        return res.json({
          status: "success",
          movie,
        });
      } else {
        res.status(404);
        throw new Error("film not found!");
      }
    } else {
      res.status(400);
      throw new Error("Invalid Id or id not passed as paramater in the url");
    }
  } else {
    res.status(403);
    throw new Error("only an admin can perform this function!");
  }
});

// delete movie by id

export const deleteFilm = asyncHanlder(async (req, res) => {
  const { id: filmId } = req.params;

  if (req.user.isAdmin) {
    if (filmId) {
      let movie = await movieModel.findById(filmId);
      if (movie) {
        movie = await movieModel.findByIdAndDelete(movie._id);
        return res.json({
          status: "success",
          msg: "deleted successfully",
        });
      } else {
        res.status(404);
        throw new Error("movie not found!");
      }
    } else {
      res.status(400);
      throw new Error("Invalid Id or id not passed as paramater in the url");
    }
  } else {
    res.status(403);
    throw new Error("only an admin can perform this function!");
  }
});
