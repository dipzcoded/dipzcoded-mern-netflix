import React, { useEffect } from "react";
import "./home.scss";
import Navbar from "../../components/navbar/Navbar";
import Featured from "../../components/feature/Featured";
import List from "../../components/list/List";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

function Home({ type }) {
  // history init
  const history = useHistory();
  const { userData } = useSelector((state) => state.authLogin);
  useEffect(() => {
    if (!userData && !userData?.user) {
      history.push("/login");
    }
  }, [userData, history]);
  return (
    <div className="home">
      <Navbar />
      <Featured type={type} />
      <List />
      <List />
      <List />
      <List />
    </div>
  );
}

export default Home;
