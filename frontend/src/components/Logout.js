import React from 'react'
import { useHistory } from "react-router-dom";

const Logout = () => {
let history = useHistory();

  function handleClick() {
    history.push("/login");
  }
    return (
        <div>
            <div className="title"><h4>You have logged out</h4></div>
            <div className="subtitle"><h4>Start the fun again and log back in!</h4></div>
            <button className="button" onClick={handleClick} >login</button>

          
        </div>
    )
}

export default Logout
