import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../../actions/auth";
import { USER_REGISTER_RESET } from "../../types/auth";
import "./login.scss";

function Login() {
  // dispatch init
  const dispatch = useDispatch();
  // history init
  const history = useHistory();
  const { userData, isLoading } = useSelector((state) => state.authLogin);
  const { success: registerSuccess } = useSelector(
    (state) => state.authRegister
  );

  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };
  const { email, password } = formData;

  useEffect(() => {
    if (!isLoading && userData && userData?.user) {
      history.push("/");
    }

    if (registerSuccess) {
      dispatch({ type: USER_REGISTER_RESET });
    }

    if (userData) {
      setformData({
        email: "",
        password: "",
      });
    }
  }, [history, userData, isLoading, registerSuccess, dispatch]);

  return (
    <div className="login">
      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt=""
          />
        </div>
      </div>
      <div className="container">
        <form onSubmit={onSubmit}>
          <h1>Sign In</h1>
          <input
            type="email"
            placeholder="Email or phone number"
            name="email"
            value={email}
            onChange={onChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
          />
          <button className="loginButton">Sign In</button>
          <span>
            New to Netflix? <b>Sign up now.</b>
          </span>
          <small>
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot. <b>Learn more</b>.
          </small>
        </form>
      </div>
    </div>
  );
}

export default Login;
