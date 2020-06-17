import React, { useContext } from "react";

import "./Navlink.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

const Navlinks = () => {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/" exact>
            Home
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/dashboard" exact>
            Dashboard
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/myfoods" exact>
            My Foods
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/profile" exact>
            Profile
          </NavLink>
        </li>
      )}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Sign Up</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>Logout</button>
        </li>
      )}
    </ul>
  );
};

export default Navlinks;
