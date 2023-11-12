import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Logout({setLoggedIn}) {
  const navigateTo = useNavigate();

  function handleCancel() {
    navigateTo("/movies");
  }

  async function handleLogout() {
    var body = {
      refreshToken: localStorage.getItem("refreshToken"),
    };

    await axios
      .post(`${BASE_URL}/user/logout`, body)
      .then((res) => {
        console.log(res);

        localStorage.removeItem("email");
        localStorage.removeItem("bearerToken");
        localStorage.removeItem("refreshToken");

        console.log("successfully logged out");
        // window.location.reload()
        setLoggedIn(false)
        navigateTo("/movies");
      })
      .catch((err) => {
        alert("failed to logout")
        console.log(err);
      });
  }

  return (
    <div className="logout" style={{ backgroundColor: "#ffffff" }}>
      <div style={logoutStyle}>
        Are you sure <br></br>you want to logout?
      </div>
      <div className="logout__button">
        <Button
          variant="contained"
          sx={{ my: "auto", mx: "2rem" }}
          size="medium"
          onClick={handleCancel}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          sx={{ my: "auto", mx: "2rem" }}
          size="medium"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
const logoutStyle = {
  backgroundColor: "#a0c0c2",
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  textAlign: "center",
  paddingTop: "5.5vh",
  fontSize: 25,
  fontWeight: 500,
  color: "black",
};
