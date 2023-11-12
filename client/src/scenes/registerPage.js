import { useState, useRef } from "react";
import { TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { FormLabel } from "react-bootstrap";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import KeyIcon from "@mui/icons-material/Key";
import { Alert } from "@mui/material";
import Grid from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Register() {

  const emailRef = useRef();
  const passwordRef = useRef();
  const repeatPasswordRef = useRef();

  const [result,setResult]=useState("")

  function handleSubmit() {
    setResult("")

    console.log(emailRef.current.value);
    console.log(passwordRef.current.value);
    console.log(repeatPasswordRef.current.value);
    
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const repeatPassword = repeatPasswordRef.current.value;

    // see if there is any required field not being filled out
    if(isEmpty(password) || isEmpty(email) || isEmpty(repeatPassword)){
      console.log("empty")
      setResult("empty")
      return
    }

    // see if the email address is valid
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailformat)) {
      console.log("invalid email")
      setResult("email")
      return
    }

    // see if these passwords match
    if (password !== repeatPassword) {
      console.log("Passwords didn't match")
      setResult("password")
      return
    }

    // good to send request to register a new user
    var body = {
      email: email,
      password: password,
    };

    axios
      .post(`${BASE_URL}/user/register`, body)
      .then((res) => {
        console.log(res);
        // alert("Successfully registered a new user !!!")
        setResult("success")
      })
      .catch((err) => {
        if(err.response.status===409){
          //"User already exists"
          setResult("exists")
        }

        console.log(err);
      });
  }

  return (
    <div className="register ">
      <div className='register__form'>
        <p className="register-title">Sign Up</p>

        <div className="register-text-field">
          <PersonIcon fontSize="large" />
          <TextField
            id="name-basic"
            label="Your Name (Optional)"
            variant="outlined"
            size="small"
          />
        </div>

        <div className="register-text-field">
          <EmailIcon fontSize="large" />

          <TextField
            id="email-basic"
            label="Email Address"
            variant="outlined"
            inputRef={emailRef}
            size="small"
          />
        </div>

        <div className="register-text-field">
          <PasswordIcon fontSize="large" />

          <TextField
            type="password"
            id="password-basic"
            label="Password"
            variant="outlined"
            inputRef={passwordRef}
            size="small"
          />
        </div>

        <div className="register-text-field">
          <KeyIcon fontSize="large" />

          <TextField
            type="password"
            id="repeat-password-basic"
            label="Repeat Password"
            variant="outlined"
            inputRef={repeatPasswordRef}
            size="small"
          />
        </div>

        <Button
          variant="contained"
          sx={{ my: "auto", mx: "5rem" }}
          size="medium"
          onClick={handleSubmit}
        >
          REGISTER
        </Button>

      </div>

      <div className="register-aside">
        <div>
        {result==="empty" && <Alert severity="error">Please fill out all the required fields.</Alert>}
        {result==="email" && <Alert severity="error">Invalid email address. Try again.</Alert>}
        {result==="password" && <Alert severity="error">Those passwords didn’t match. Try again.</Alert>}
        {result==="success" && <Alert severity="success">Success! Your account has been created.</Alert>}
        {result==="exists" && <Alert severity="error">User already exists. Try again.</Alert>}

        </div>

        <div className="register-aside__image" >
          {/* <img src="https://images.unsplash.com/photo-1525909002-1b05e0c869d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80"/> */}
          </div>
      </div>
    </div>  
  );
}

function isEmpty(str) {
    return (!str || str.length === 0 );
}
