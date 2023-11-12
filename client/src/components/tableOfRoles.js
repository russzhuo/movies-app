import { useState, useEffect,useRef,useCallback,useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-balham.css"; // Optional theme CSS
import { useNavigate } from "react-router-dom";


function TableOfRoles({ data }) {
//   const navigateTo = useNavigate();
//   const [data, setData] = useState([]);
const gridRef = useRef();
const weight=1.75
const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      filter: true,
    };
  }, []);

  const [columnDefs, setColumnDefs] = useState([
    {
      title: "Role",
      field: "category",
      width: 160/weight
      
    },
    {
      title: "Movie",
      field: "movieName",
      width: 400/weight

    },
    {
      title: "Characters",
      field: "characters",
      width: 250/weight

    },
    {
      title: "Rating",
      field: "imdbRating",
      width: 200/weight

    }
  ]);

  const onFirstDataRendered = useCallback((params) => {
    gridRef.current.api.sizeColumnsToFit();
  }, []);

  return (
      <div style={gridStyle} className="ag-theme-balham">
      
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          pagination={true}
          defaultColDef={defaultColDef}
          paginationPageSize={7}
          rowData={data}
        // onFirstDataRendered={onFirstDataRendered}
        ></AgGridReact>
   </div>
  );
}

export default TableOfRoles;
