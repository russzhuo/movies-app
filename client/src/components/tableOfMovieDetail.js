import { useState, useEffect,useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-balham.css"; // Optional theme CSS
import { useNavigate } from "react-router-dom";

function TableOfMovieDetail({principals}){
    const navigateTo=useNavigate()
    const weight=0.78;
    const gridStyle = useMemo(() => ({ height: '90%', width: '97%' }), []);

    function cellClickHandler(e){
      console.log(localStorage.getItem('bearerToken'))
      if(localStorage.getItem('bearerToken')){
        navigateTo(`/people/${e.data.id}`)
      }else{
        alert("The content is restricted to authenticated users. Please sign in !")
        navigateTo('/login')
      }
    }

    
    const [columnDefs, setColumnDefs] = useState([
        {
          headerName: "Role",
          field: "category",
          width:80/weight
        },
        {
          field: "name",
          onCellClicked: (event) => cellClickHandler(event),
          width:120/weight
        },
        {
          field: "characters",
          width:105/weight
        }])
    
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
  }));

        return (
              <div
                className="ag-theme-balham"
                style={gridStyle}
              >
                <AgGridReact
                  className="tableMovies"
                  columnDefs={columnDefs}
                  pagination={true}
                  paginationPageSize={5}
                  defaultColDef={defaultColDef}
                  rowData={principals}
                ></AgGridReact>
              </div>
          );
        
}

export default TableOfMovieDetail;