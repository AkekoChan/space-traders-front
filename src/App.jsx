import { useAuthContext } from "./context/authContext";
import { useNavigate, Outlet } from "react-router";

import Header from "./components/header/Header.jsx";

const App = () => {
  const { userToken } = useAuthContext();

  const navigate = useNavigate();
  if (!userToken) {
    navigate("/login");
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default App;
