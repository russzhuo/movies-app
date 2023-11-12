import { useState, useRef } from "react";
import { TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { FormLabel } from "react-bootstrap";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PasswordIcon from "@mui/icons-material/Password";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Login({setLoggedIn}) {

  const [inputError,setInputError]=useState("")
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  async function handleSubmit() {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // see if there is any required field not being filled out
    if(isEmpty(password) || isEmpty(email)){
      console.log("empty")
      setInputError("empty")
      return
    }

    // see if the email address is valid
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailformat)) {
      console.log("invalid email")
      setInputError("email")
      return
    }

    var body = {
      email: email,
      password: password,
      longExpiry: false,
    };

    console.log(`${BASE_URL}/user/login`);

    await axios
      .post(`${BASE_URL}/user/login`, body)
      .then((res) => {
        console.log(res);

        localStorage.setItem("bearerToken", res.data.bearerToken.token);
        localStorage.setItem("refreshToken", res.data.refreshToken.token);
        localStorage.setItem("email", email);
        console.log("successfully logged in");
        // window.location.reload()
        setLoggedIn(true)
        navigate("/movies");
      })
      .catch((err) => {
        console.log(err)
        if(err.response.status===401){
          setInputError('notFound')
        }
      });
  }

  return (
    <div className="login ">
      <FormControl>
        <p className="register-title">Login</p>
          

        <div className="login__text-field">
          <EmailIcon fontSize="large" />
          <TextField
            inputRef={emailRef}
            id="email-basic"
            label="Email Address"
            variant="outlined"
            size="small"
          />
        </div>
        <div className="login__text-field">
          <PasswordIcon fontSize="large" />
          <TextField
            type="password"
            inputRef={passwordRef}
            id="password-basic"
            label="Password"
            variant="outlined"
            size="small"
          />
        </div>
        <div className="login__alert-bar">
        {inputError==="empty" && <Alert severity="error">Please fill out all the required fields.</Alert>}
        {inputError==="email" && <Alert severity="error">Invalid email address. Try again.</Alert>}
        {inputError==="notFound" && <Alert severity="error">User not found. Try again.</Alert>}
        </div>
        <Button
          variant="contained"
          sx={{ my: "auto", mx: "4rem" }}
          size="medium"
          onClick={handleSubmit}
        >
          LOGIN
        </Button>
      </FormControl>
    </div>
  );
}

function isEmpty(str) {
  return (!str || str.length === 0 );
}
