import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import cookie from "js-cookie";

// reducers
import {
  authLoginReducer,
  authRegisterReducer,
  authLogoutReducer,
  generateNewRefreshTokenReducer,
} from "./reducers/auth";

// reducers
const reducers = combineReducers({
  authRegister: authRegisterReducer,
  authLogin: authLoginReducer,
  authLogout: authLogoutReducer,
  generateNewRefreshToken: generateNewRefreshTokenReducer,
});

// get data from cookie
const authDataFromCookieStorage = cookie.get("authData")
  ? JSON.parse(cookie.get("authData"))
  : null;

const initialState = {
  authLogin: {
    userData: authDataFromCookieStorage,
  },
};

// middleware
const middleware = [thunk];

const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
