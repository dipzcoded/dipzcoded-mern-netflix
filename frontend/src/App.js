import { useEffect } from "react";
import "./app.scss";
import MainLayout from "./MainLayout";
import { generateNewFreshToken } from "./actions/auth";
import { useSelector, useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
function App() {
  // dispatch init
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.authLogin);

  useEffect(() => {
    if (userData && userData?.user) {
      let currentDate = new Date();
      const decodedToken = jwtDecode(userData?.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        dispatch(generateNewFreshToken());
      }
    }
  }, [userData, dispatch]);
  return (
    <>
      <MainLayout />
    </>
  );
}

export default App;
