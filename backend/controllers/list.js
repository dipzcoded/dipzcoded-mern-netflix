import asyncHanlder from "express-async-handler";
import listModel from "../models/List.js";
import movieModel from "../models/Movie.js";

export const getFilmList = asyncHanlder(async (req, res) => {
  let resData;
  const { type, genre: genreQuery } = req.query;
  console.log(genreQuery);
  if (type) {
    if (genreQuery) {
      resData = await listModel.find({ type: { $in: type } });

      resData = resData.filter((el) => el.genre.includes(genreQuery));
      resData = resData.sort(() => Math.random() - 0.5).slice(0, 10);
    } else {
      resData = await listModel.find({ type: { $in: type } });
      resData = resData.sort(() => Math.random() - 0.5).slice(0, 10);
    }
  } else {
    resData = await listModel.find();
    resData = resData.sort(() => Math.random() - 0.5).slice(0, 10);
  }
  res.json({
    status: "success",
    lists: resData,
  });
});

export const getListById = asyncHanlder(async (req, res) => {
  const { id: listId } = req.params;

  if (listId) {
    const list = await listModel.findById(listId);
    if (list) {
      return res.json({
        status: "success",
        list,
      });
    } else {
      res.status(404);
      throw new Error("list not found!");
    }
  } else {
    res.status(400);
    throw new Error("Invalid Id or id not passed as paramater in the url");
  }
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
  let type;

  if (req.user.isAdmin) {
    if (listId) {
      const list = await listModel.findById(listId);
      const film = await movieModel.findById(filmId);
      if (list && film) {
        type = film.isSeries ? "series" : "movies";
        if (list.contents.length > 0) {
          const listFound = list.contents.find(
            (el) => String(el._id) === String(film._id)
          );

          if (!listFound && film.genre.includes(list.genre)) {
            if (String(list.type) === String(type)) {
              list.contents.push(film._id);
              await list.save();
              return res.json({
                status: "success",
                list,
              });
            } else {
              res.status(400);
              throw new Error("the list type is not the same with the film");
            }
          } else {
            res.status(400);
            throw new Error(
              "film has been added to the contents field or film genre is not similar to the list genre"
            );
          }
        } else {
          if (
            String(list.type) === String(type) &&
            film.genre.includes(list.genre)
          ) {
            list.contents.push(film._id);
            await list.save();
            return res.json({
              status: "success",
              list,
            });
          } else {
            res.status(400);
            throw new Error("the list type is not the same with the film");
          }
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
            (el) => String(el._id) === String(filmId)
          );
          if (filmFound) {
            list.contents = list.contents.filter(
              (el) => String(el._id) !== String(filmFound._id)
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
