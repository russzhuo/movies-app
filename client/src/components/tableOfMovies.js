import { useState, useEffect,useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-balham.css"; // Optional theme CSS
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TableOfMovies({ query }) {
  const navigateTo = useNavigate();
  const [data, setData] = useState([]);
  
  useEffect(() => {
    console.log("query updated");
    
    const getMovies = async () => {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
      };

      await axios
        .get(query, { headers })
        .then((res) => setData(res.data.data))
        .catch((e) => console.log(e));
    };

    getMovies();
  }, [query]);


  const weight=1;

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Title",
      field: "title",
      minWidth: 265/weight,
      onCellClicked: (event) => navigateTo(`/movies/${event.data.imdbID}`),
      // cellStyle: {color:'black'}

    },
    {
      headerName: "Year",
      field: "year",
      maxWidth: 80/weight,
    },
    {
      headerName: "IMDB rating",
      maxWidth: 120/weight,
      field: "imdbRating",
    },
    {
      headerName: "RottenTomatoes",
      field: "rottenTomatoesRating",
      maxWidth: 135/weight,
    },
    {
      headerName: "Metacritic",
      field: "metacriticRating",
      maxWidth: 105/weight,
    },
    {
      headerName: "Rated",
      field: "classification",
      maxWidth: 115,
    },
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
  }));

  // const cellClickedListener = useCallback((event) => {
  //   console.log("cellClicked", event);
  // }, []);

  console.log("updated");

  return (
      <div
        className="ag-theme-balham"
        style={{ height: "100%", width: "100%"}}
      >
        <AgGridReact
          className="tableMovies"
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={13}
          rowData={data}
          defaultColDef={defaultColDef}
        ></AgGridReact>
      </div>
  );
}

export default TableOfMovies;
