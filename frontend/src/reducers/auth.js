import {
  USER_LOGIN_FAIL,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_REQUEST,
  USER_REGISTER_FAIL,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_REQUEST,
  USER_REGISTER_RESET,
  USER_LOGOUT_FAIL,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
  GEN_NEW_REFRESHTOKEN_FAIL,
  GEN_NEW_REFRESHTOKEN_REQUEST,
  GEN_NEW_REFRESHTOKEN_SUCCESS,
} from "../types/auth";

export const authRegisterReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_REGISTER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case USER_REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        error: null,
      };

    case USER_REGISTER_FAIL:
      return {
        ...state,
        isLoading: false,
        success: false,
        error: payload,
      };

    case USER_REGISTER_RESET:
      return {};

    default:
      return state;
  }
};

export const authLoginReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userData: payload,
        error: null,
      };

    case USER_LOGIN_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };

    case GEN_NEW_REFRESHTOKEN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userData: {
          ...state.userData,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
        },
      };

    case USER_LOGOUT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userData: null,
      };

    default:
      return state;
  }
};

export const authLogoutReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case USER_LOGOUT_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };

    default:
      return state;
  }
};

export const generateNewRefreshTokenReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case GEN_NEW_REFRESHTOKEN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case GEN_NEW_REFRESHTOKEN_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };

    default:
      return state;
  }
};
