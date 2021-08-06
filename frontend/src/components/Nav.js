import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const logOutHandler = async () => {
  await axios.get("/logout");
};
const Nav = (props) => {
  return (
    <nav className="nav">
      <ul className="un-list">
        <div className="li-container">
          <div className="li-item-container">
            <li className="li-list">
              <Link className="link" to="/">
                Home
              </Link>
            </li>
          </div>
          <div className="li-item-container">
            <li className="li-list">
              <Link className="link" to="/profile">
                Profile
              </Link>
            </li>
          </div>
          <div className="li-item-container">
            <li className="li-list">
              <Link className="link" to="/login">
                Login
              </Link>
            </li>
          </div>
          <div className="li-item-container">
            <li className="li-list">
              <Link to="/logout" className="link" onClick={logOutHandler}>
                Logout
              </Link>
            </li>
          </div>
        </div>
        {/* <li className="li-list">
                        <Link className='link-register' to="/register">Register</Link>
                    </li> */}
      </ul>
    </nav>
  );
};

export default Nav;
