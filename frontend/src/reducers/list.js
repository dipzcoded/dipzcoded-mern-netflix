import {
  GET_FILM_LIST_FAIL,
  GET_FILM_LIST_REQUEST,
  GET_FILM_LIST_SUCCESS,
} from "../types/list";

export const getFilmListReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_FILM_LIST_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case GET_FILM_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        lists: payload.lists,
        error: null,
      };

    case GET_FILM_LIST_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };

    default:
      return state;
  }
};
