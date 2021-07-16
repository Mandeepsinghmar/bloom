import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../../App";
import "./style.css";

function Login() {
  const { dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const PostData = () => {
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setLoading(true);
        }
        if (data.error) {
          M.toast({
            html: data.error,
            classes: "#e53935 red darken-1 rounded",
          });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: "SignedIn success",
            classes: "#43a047 green darken-1 rounded",
          });
          history.push("/explore");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="card-container auth">
      <div className=" card card-content ">
        <h2> Bloom</h2>
        <input
          className="input-style"
          type="text"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={{ position: "relative" }}
          className="input-style"
          type={showPassword ? "text" : "password"}
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            cursor: "pointer",
            right: "30px",
            top: "218px",
            fontSize: "1.2rem",
          }}
        >
          <i className="bx bxs-show"></i>
        </span>
        <button
          className="btn waves-effect waves-light login-btn"
          onClick={() => PostData()}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>
          <Link to="signup">Don't have an account?</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
