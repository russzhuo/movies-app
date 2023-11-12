import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Home from "./scenes/homePage";
import Login from "./scenes/loginPage";
import Movies from "./scenes/moviesPage";
import Register from "./scenes/registerPage";
import Header from "./components/header";
import Logout from "./scenes/logoutPage";
import Footer from "./components/footer";
import MovieDetail from "./scenes/movieDetailPage";
import Person from "./scenes/personPage";
import NotFound from "./scenes/notFoundPage";
import { useEffect,createContext ,useContext,useState } from "react";

function App() {  
  
  const [loggedIn,setLoggedIn] = useState(localStorage.getItem('bearerToken')?true:false)

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Header loggedIn={loggedIn}/>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/movies" element={<Movies />}></Route>
          <Route path="/movies/:id" element={<MovieDetail />}></Route>
          <Route path="/people/:id" element={<Person/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn}/>}></Route>
          <Route path="/logout" element={<Logout setLoggedIn={setLoggedIn}/>}></Route>
          {/* <Route path="/notFound" element={<NotFound/>} /> */}
          <Route path="/*" element={<NotFound/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );

}



export default App;
