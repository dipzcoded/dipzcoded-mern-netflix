import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./screens/home/Home";
import Login from "./screens/login/Login";
import Register from "./screens/register/Register";
import Watch from "./screens/watch/Watch";

function MainLayout() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/movies">
          <Home type="movies" />
        </Route>
        <Route exact path="/series">
          <Home type="series" />
        </Route>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/watch" component={Watch} />
      </Switch>
    </>
  );
}

export default MainLayout;
