import axios from "axios";
import { useLocation ,useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import TableOfMovieDetail from "../components/tableOfMovieDetail";
const BASE_URL = process.env.REACT_APP_BASE_URL;

  // http://sefdb02.qut.edu.au:3000/movies/data/tt0120596

export default function MovieDetail() {
  const navigateTo=useNavigate();
  const imdbID = getImdbID(useLocation().pathname);
  const [movieInfo,setMovieInfo]=useState({})

  useEffect(()=>{
    const getMovieInfo=async()=>{
    await axios.get(`${BASE_URL}/movies/data/${imdbID}`)
    .then(res=>{
      console.log(res)
      setMovieInfo(res.data)
    })
    .catch(e=>{
      console.log(e);
      if(e.response.status===404){
        alert('imdb ID not found!')
      }
    })}

    getMovieInfo();
  },[])

  if (JSON.stringify(movieInfo)==='{}'){
    console.log('is {}')
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Invalid imdbID</h1>
      </div>
    );
  }

  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });
  
  return (
    <div className="movie-detail">
      <div className="movie-detail__overview">
        <h5>{movieInfo.title}</h5> 
        <p style={{fontSize:14}}>Released in: {movieInfo.year}
        <br/>Runtime:  {movieInfo.runtime} minutes
        <br/>Genres: {JSON.stringify(movieInfo)!=='{}' && movieInfo.genres.join(' ')}
        <br/>Country: {movieInfo.country}
        <br/>Box Office: {formatter.format(movieInfo.boxoffice)}
        </p>
        <p style={{fontStyle:"italic",fontSize:14}}>{movieInfo.plot}</p>
        </div>
        {/* <img src={movieInfo.poster}></img> */}
      <div className="movie-detail__table">
      <TableOfMovieDetail principals={movieInfo.principals}></TableOfMovieDetail>
      </div>
      <img className="movie-detail__image" src={movieInfo.poster} />
      <div className="movie-detail__ratings">
      <p style={{fontSize:14}}>Internet Movie Database:
        <br/>
        {movieInfo.ratings[0].value ? movieInfo.ratings[0].value+(' /10') : <br/> } 
        </p>
        <p>Rotten Tomatoes:
        <br/>
        {movieInfo.ratings[1].value ? movieInfo.ratings[1].value+(' %') : <br/> } 
        </p>
        <p>Metacritic:
        <br/>
        {movieInfo.ratings[2].value ? movieInfo.ratings[2].value+(' /100') : <br/> } 
        </p>
      </div>
    </div>
  );
}

const getImdbID = (path) => {
  const start = path.lastIndexOf("/") + 1;
  return path.slice(start);
};
