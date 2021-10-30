import asyncHanlder from "express-async-handler";
import listModel from "../models/List.js";
import movieModel from "../models/Movie.js";

export const getFilmList = asyncHanlder(async (req, res) => {
  let resData;
  const { type, genre: genreQuery } = req.query;
  console.log(genreQuery);
  if (type) {
    if (genreQuery) {
      resData = await listModel.aggregate([
        { $sample: { size: 10 } },
        { $match: { type } },
      ]);
      resData = resData.filter((el) => el.genre.includes(genreQuery));
    } else {
      resData = await listModel.aggregate([
        { $sample: { size: 10 } },
        { $match: { type } },
      ]);
    }
  } else {
    resData = await listModel.aggregate([
      {
        $sample: { size: 10 },
      },
    ]);
  }
  res.json({
    status: "success",
    lists: resData,
  });
});

export const createFilmList = asyncHanlder(async (req, res) => {
  if (req.user.isAdmin) {
    const { title, type, genre } = req.body;
    const newFilmList = new listModel();
    newFilmList.title = title;
    newFilmList.type = type;
    newFilmList.genre = genre;

    const filmList = await newFilmList.save();
    res.json({
      status: "success",
      filmList,
    });
  } else {
    res.status(403);
    throw new Error("only an admin can perform this function!");
  }
});

export const addFilmToListContents = asyncHanlder(async (req, res) => {
  const { id: listId, filmId } = req.params;

  if (req.user.isAdmin) {
    if (listId) {
      const list = await listModel.findById(listId);
      const film = await movieModel.findById(filmId);
      if (list && film) {
        if (list.contents.length > 0) {
          const listFound = list.contents.find(
            (id) => String(id) === String(filmId)
          );
          if (!listFound && list.genre.includes(film.genre)) {
            list.contents.push(film._id);
            await list.save();
            return res.json({
              status: "success",
              list,
            });
          } else {
            res.status(400);
            throw new Error(
              "film has been added to the contents field or film genre is not similar to the list genre"
            );
          }
        } else {
          list.contents.push(filmId);
          await list.save();
          return res.json({
            status: "success",
            list,
          });
        }
      } else {
        res.status(404);
        throw new Error("list not found! or movie not found! check database!");
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

export const removeFilmFromListContents = asyncHanlder(async (req, res) => {
  const { id: listId, filmId } = req.params;

  if (req.user.isAdmin) {
    if (listId) {
      const list = await listModel.findById(listId);
      const film = await movieModel.findById(filmId);
      if (list && film) {
        if (list.contents.length > 0) {
          const filmFound = list.contents.find(
            (id) => String(id) === String(filmId)
          );
          if (filmFound) {
            list.contents = list.contents.filter(
              (el) => String(el) !== String(filmFound._id)
            );
            await list.save();
            return res.json({
              status: "success",
              list,
            });
          } else {
            res.status(400);
            throw new Error("film has been removed from the content list");
          }
        } else {
          res.status(400);
          throw new Error("can't not remove a film from an empty content list");
        }
      } else {
        res.status(404);
        throw new Error("list not found! or movie not found! check database!");
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
