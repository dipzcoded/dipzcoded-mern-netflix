import React, { useRef, useState, useEffect } from "react";
import "./register.scss";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { register } from "../../actions/auth";

function Register() {
  // dispatch init
  const dispatch = useDispatch();
  // history init
  const history = useHistory();
  const { success: registerSuccess } = useSelector(
    (state) => state.authRegister
  );
  const { userData, isLoading } = useSelector((state) => state.authLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const emailRef = useRef();
  const passwordRef = useRef();
  const userNameRef = useRef();

  const handleStart = () => {
    setEmail(emailRef.current.value);
  };
  const handleFinish = () => {
    setPassword(passwordRef.current.value);
    setUserName(userNameRef.current.value);
  };

  useEffect(() => {
    if (!isLoading && userData && userData?.user) {
      history.push("/");
    }

    if (registerSuccess) {
      history.push("/login");
      setPassword("");
      setEmail("");
      setUserName("");
    }
  }, [registerSuccess, history, userData, isLoading]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ userName, email, password }));
  };

  return (
    <div className="register">
      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt=""
          />
          <button className="loginButton">Sign In</button>
        </div>
      </div>
      <div className="container">
        <h1>Unlimited movies, TV shows, and more.</h1>
        <h2>Watch anywhere. Cancel anytime.</h2>
        <p>
          Ready to watch? Enter your email to create or restart your membership.
        </p>
        {!email ? (
          <div className="input">
            <input type="email" placeholder="email address" ref={emailRef} />
            <button className="registerButton" onClick={handleStart}>
              Get Started
            </button>
          </div>
        ) : (
          <form className="input" onSubmit={onSubmit}>
            <input type="text" placeholder="username" ref={userNameRef} />
            <input type="password" placeholder="password" ref={passwordRef} />
            <button className="registerButton" onClick={handleFinish}>
              Start
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
