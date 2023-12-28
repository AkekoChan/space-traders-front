import { useAuthContext } from "./context/authContext";
import { useNavigate } from "react-router";

const App = () => {
  const { userToken, logout } = useAuthContext();
  const navigate = useNavigate();
  if (!userToken) {
    navigate("/login");
  }
  console.log("userToken", userToken);
  return (
    <>
      <button onClick={logout}>Logout</button>
    </>
  );
};

export default App;
