import axios from "axios";
import cookie from "js-cookie";
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_LOGOUT_FAIL,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
  GEN_NEW_REFRESHTOKEN_FAIL,
  GEN_NEW_REFRESHTOKEN_REQUEST,
  GEN_NEW_REFRESHTOKEN_SUCCESS,
} from "../types/auth";

export const register = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    const body = JSON.stringify(formData);
    await axios.post(`/api/auth/register`, body, config);
    dispatch({ type: USER_REGISTER_SUCCESS });
  } catch (err) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        err.response && err.response.data.detail
          ? err.response.data.detail
          : err.message,
    });
  }
};

export const login = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const body = JSON.stringify(formData);
    const { data } = await axios.post(`/api/auth/login`, body, config);
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    cookie.set("authData", JSON.stringify(data));
  } catch (err) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        err.response && err.response.data.detail
          ? err.response.data.detail
          : err.message,
    });
  }
};

export const logout = () => async (dispatch, getState) => {
  const {
    authLogin: { userData },
  } = getState();
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userData?.accessToken}`,
    },
  };
  try {
    dispatch({ type: USER_LOGOUT_REQUEST });
    const body = JSON.stringify({ refreshToken: userData?.refreshToken });
    await axios.post(`/api/auth/logout`, body, config);
    dispatch({
      type: USER_LOGOUT_SUCCESS,
    });
    cookie.remove("authData");
  } catch (err) {
    dispatch({
      type: USER_LOGOUT_FAIL,
      payload:
        err.response && err.response.data.detail
          ? err.response.data.detail
          : err.message,
    });
  }
};

export const generateNewFreshToken = () => async (dispatch, getState) => {
  const {
    authLogin: { userData },
  } = getState();
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    dispatch({ type: GEN_NEW_REFRESHTOKEN_REQUEST });
    const body = JSON.stringify({ refreshToken: userData?.refreshToken });
    const { data } = await axios.patch(
      `/api/auth/newrefreshtoken`,
      body,
      config
    );
    dispatch({ type: GEN_NEW_REFRESHTOKEN_SUCCESS, payload: data });
    cookie.set(
      "authData",
      JSON.stringify({
        ...userData,
        accessToken: data?.accessToken,
        refreshToken: data?.refreshToken,
      })
    );
  } catch (err) {
    dispatch({
      type: GEN_NEW_REFRESHTOKEN_FAIL,
      payload:
        err.response && err.response.data.detail
          ? err.response.data.detail
          : err.message,
    });
  }
};
