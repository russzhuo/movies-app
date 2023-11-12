import { useLocation,useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import axios from "axios";
import BarChart from "../components/chart";
import TableOfRoles from "../components/tableOfRoles";


const BASE_URL = process.env.REACT_APP_BASE_URL;

function Person() {
  const navigateTo=useNavigate()
  const id = getPrincipalID(useLocation().pathname);
  const [personInfo, setPersonInfo] = useState([]);
  console.log(useLocation().pathname)

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
    };

    const getPersonInfo = async () => {
      await axios
        .get(`${BASE_URL}/people/${id}`, { headers })
        .then((res) => {
          console.log(res);
          setPersonInfo(res.data);
        })
        .catch((e) => {
          console.log(e);
          //check if bearer token is expired
          if (e.response.status === 401) {
            console.log('token expired')
            //refresh token
            const body = { refreshToken: localStorage.getItem("refreshToken") };

            const refreshToken = async () =>
              await axios
                .post(`${BASE_URL}/user/refresh`, body)
                .then((res) => {
                    console.log(res);
                    console.log('Token Refreshed!!')
                    alert("Token Refreshed!!");
                    localStorage.setItem("bearerToken", res.data.bearerToken.token);
                    localStorage.setItem("refreshToken", res.data.refreshToken.token);
                    window.location.reload(false)
                })
                .catch(e=>{
                  console.log('failed to refresh taken')
                  console.log(e);
                  // if(e.response.status===401){
                  //   console.log('401');
                  //   alert("Token Expired. Please log in again!")
                  //   localStorage.removeItem("email");
                  //   localStorage.removeItem("bearerToken");
                  //   localStorage.removeItem("refreshToken");
            
                  //   navigateTo("/login");
                  // }
                });
            
            refreshToken();
          }else if(e.response.status===404){
            alert('Person ID not found!')
          }
    
        });
    };
    getPersonInfo();
  }, []);

  return (
    <div className="person">
        <p className="person__intro"><h2>{personInfo.name}</h2>{personInfo.birthYear}-{personInfo.deathYear}</p>
        <div className="person__roles"><TableOfRoles data={personInfo.roles}/></div> 
        <div className="person__chart">{JSON.stringify(personInfo)!=='[]'&&<BarChart ratings={personInfo.roles.map(obj=>obj.imdbRating)}/>}</div>
    </div>
  );
}


const getPrincipalID = (path) => {
  const start = path.lastIndexOf("/") + 1;
  return path.slice(start);
};
export default Person;
