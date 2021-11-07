import {
  GET_FILM_LIST_FAIL,
  GET_FILM_LIST_SUCCESS,
  GET_FILM_LIST_REQUEST,
} from "../types/list";
import axios from "axios";
export const getFilmList =
  (type = "", genre = "") =>
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
      dispatch({ type: GET_FILM_LIST_REQUEST });
      const { data } = await axios.get(
        `/api/lists${type && `?type=${type}`}${genre && `&genre=${genre}`}`,
        config
      );
      dispatch({ type: GET_FILM_LIST_SUCCESS, payload: data });
    } catch (err) {
      dispatch({
        type: GET_FILM_LIST_FAIL,
        payload:
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message,
      });
    }
  };
