import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import "./Navbar.css";

function Navbar() {
  const [toggle, setToggle] = useState(false);
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <li key="home">
          <Link className="link" to="/">
            <i className="material-icons">home</i>
            <p>Home</p>
          </Link>
        </li>,
        <li key="explore">
          <Link to="/explore" className="link">
            <i className="material-icons">explore</i>
            <p>Explore</p>
          </Link>
        </li>,

        <li key="profile" onMouseLeave={() => setToggle(false)}>
          <div className="profile">
            <div
              onMouseEnter={() => setToggle(true)}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {state && <img src={state.pic} alt="" />}
              {state && <p>{state.name}</p>}
            </div>

            {toggle && (
              <div className="profile-items">
                <div className="link">
                  <Link to="/profile">
                    <p>Profile</p>
                  </Link>
                </div>

                <div className=" link">
                  <p
                    onClick={() => {
                      localStorage.clear();
                      dispatch({ type: "CLEAR" });
                      history.push("/login");
                    }}
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>
        </li>,
      ];
    } else {
      return [
        <li key="login" style={{ margin: "10px" }}>
          <Link className="signin-btn" to="/login">
            Login
          </Link>
        </li>,
        <li key="signup" style={{ margin: "10px" }}>
          <Link className="signup-btn" to="/signup">
            Signup
          </Link>
        </li>,
      ];
    }
  };
  return (
    <div className="navbar">
      <div className="navbar-container">
        <Link to={state ? "/" : "/login"} className="brand-logo">
          Bloom
        </Link>
        <ul className="links">{renderList()}</ul>
      </div>
    </div>
  );
}

export default Navbar;
