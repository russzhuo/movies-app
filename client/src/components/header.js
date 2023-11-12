import Container from "react-bootstrap/Container";
// import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useScrollTrigger } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function Header({loggedIn}) {
  console.log('header');
  return (
  <div className="nav">
    <NavLink
      className={({ isActive }) => (isActive ? "nav-item--active" : "nav-item")}
      to="/"
    >
      Home
    </NavLink>
    <NavLink
      className={({ isActive }) => (isActive ? "nav-item--active" : "nav-item")}
      to="/movies"
    >
      Movies
    </NavLink>
    {loggedIn ? (
      <NavLink
        className={({ isActive }) =>
          isActive ? "nav-item--active" : "nav-item"
        }
        to="/logout"
      >
        Logout
      </NavLink>
    ) : (
      <NavLink
        className={({ isActive }) =>
          isActive ? "nav-item--active" : "nav-item"
        }
        to="/register"
      >
        Register
      </NavLink>
    )}
    {loggedIn ? (
      <NavLink className="nav-item__email" disabled>
                {localStorage.getItem("email")}
      </NavLink>
    ) : (
      <NavLink
        className={({ isActive }) =>
          isActive ? "nav-item--active" : "nav-item"
        }
        to="/login"
      >
        Login
      </NavLink>
    )}
  </div>)
}

export default Header;
