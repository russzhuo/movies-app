import {
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Button,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TableOfMovies from "../components/tableOfMovies";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function Movies() {
  const years = range(1990, 2024);
  const textRef = useRef();
  const [year, setYear] = useState();
  
  const [query, setQuery]=useState();
  
  function handleSearch(){
    if(!textRef.current.value){
      console.log("text undefined")
      return
    }

    if(!year){
      console.log("year undefined")
      return
    } 
    
    setQuery(`${BASE_URL}/movies/search?title=${textRef.current.value}&year=${year}`)
  }

  return (
    <div className="movies" style={{fontSize: 19 }}>
      <div className="movies__search" >
      Movies containing the text
      <TextField
        style={{width: '28%'}}
        inputRef={textRef}
        id="search-text"
        label="keywords"
        variant="outlined"
        size="small"
      />
      from
      <FormControl style={{minWidth: 110}} size="small" >
        <InputLabel id="demo-simple-select-label">any year</InputLabel>
        <Select
          variant='outlined'
          id="select-year"
          label="any year"
          onChange={(e) => {
            setYear(e.target.value);
          }}
          // style={{ height: 300 }}
          >
          {years.map((year, index) => {
            return <MenuItem value={year}>{year}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <Button
      style={{marginLeft: '1vw'}}
        variant="contained"
        startIcon={<SearchIcon />}
        onClick={handleSearch}
        size='large'
      ></Button>
      </div>
      {query && <TableOfMovies query={query}/>}
    </div>
  );
}

//returns a list of numbers, starting from START to END(not included)
const range = (start, end) =>
Array(end - start)
  .fill()
  .map((_, i) => i + start);

export default Movies;
