import {
  GET_RANDOM_FILM_FAIL,
  GET_RANDOM_FILM_SUCCESS,
  GET_RANDOM_FILM_REQUEST,
} from "../types/film";
import axios from "axios";

export const getRandomFilm =
  (type = "") =>
  async (dispatch, getState) => {
    const {
      authLogin: { userData },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userData?.accessToken}`,
      },
    };

    try {
      dispatch({ type: GET_RANDOM_FILM_REQUEST });
      const { data } = await axios.get(
        `/api/films/random${type && `?type=${type}`}`,
        config
      );
      dispatch({ type: GET_RANDOM_FILM_SUCCESS, payload: data });
    } catch (err) {
      dispatch({
        type: GET_RANDOM_FILM_FAIL,
        payload:
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message,
      });
    }
  };
