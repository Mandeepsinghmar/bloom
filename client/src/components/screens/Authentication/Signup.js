import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

function Signup() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const uploadFields = () => {
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#f44336 red" });
        } else if (
          !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
          )
        ) {
          M.toast({ html: "Invalid email", classes: "#f44336 red" });
          return;
        } else if (
          !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(
            password
          )
        ) {
          M.toast({
            html: "Password should be minimum 8 characters, at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character.",

            classes: "toast",
          });
          return;
        } else {
          setLoading(true);
          M.toast({ html: data.message, classes: " dark blue" });
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const PostData = () => {
    uploadFields();
  };

  return (
    <div>
      <div className="card-container auth">
        <div className=" card card-content">
          <h2>Bloom</h2>
          <input
            className="input-style"
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input-style"
            type="text"
            placeholder="Email"
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
              top: "240px",
              fontSize: "1.2rem",
            }}
          >
            <i className="bx bxs-show"></i>
          </span>

          <button
            className="btn waves-effect waves-light  login-btn"
            onClick={() => PostData()}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
          <p>
            <Link to="/login">Already have an account?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
