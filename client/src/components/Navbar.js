import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";

function Navbar() {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/">
            {" "}
            <i className="material-icons">home</i>
          </Link>
        </li>,
        <li>
          <Link to="/explore">
            {" "}
            <i className="material-icons">explore</i>
          </Link>
        </li>,
        ,
        <li>
          <Link to="/profile">
            {" "}
            <i className="material-icons">account_box</i>
          </Link>
        </li>,

        <li>
          <p
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/login");
            }}
          >
            <img
              style={{
                cursor: "pointer",
                width: "21px",
                height: "21px",
                textAlign: "center",
              }}
              src="data:image/png;base64,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"
              // src="https://cdn.icon-icons.com/icons2/2518/PNG/512/logout_icon_151219.png"
              alt="logout-image"
            />
          </p>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link className="signin-btn" to="/login">
            Login
          </Link>
        </li>,
        <li>
          <Link className="signup-btn" to="/signup">
            Signup
          </Link>
        </li>,
      ];
    }
  };
  return (
    <div
      className="navbar"
      style={{
        position: "fixed",
        top: "0",
        zIndex: "10",
        width: "100%",
        margin: "auto ",
        padding: "13px 50px",

        backgroundColor: "white",
        borderBottom: "0.5px solid rgba(219,219,219)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "5px",
        }}
      >
        <Link to={state ? "/" : "/login"} className="brand-logo">
          Gamer
        </Link>
        <ul
          id="links"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            gap: "25px",
            opacity: "0.9",
          }}
        >
          {renderList()}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
