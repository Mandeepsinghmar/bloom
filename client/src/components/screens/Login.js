import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";

function Login() {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: " red" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: "SignedIn success",
            classes: "blue",
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
        <h2>
          {" "}
          Bl
          <span style={{ fontSize: "0.9rem" }}>🌸🌸</span>m
        </h2>
        <input
          className="input-style"
          type="text"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input-style"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light login-btn"
          onClick={() => PostData()}
        >
          Login
        </button>
        <p>
          <Link to="signup">Don't have an account?</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
