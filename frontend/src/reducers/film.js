import {
  GET_RANDOM_FILM_FAIL,
  GET_RANDOM_FILM_REQUEST,
  GET_RANDOM_FILM_SUCCESS,
} from "../types/film";

export const getRandomFilmReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_RANDOM_FILM_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case GET_RANDOM_FILM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        film: payload.film,
        error: null,
      };

    case GET_RANDOM_FILM_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };

    default:
      return state;
  }
};
